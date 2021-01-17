const logger = require('../logger');
MySqlDBORM = function() {   
}

MySqlDBORM.prototype = {
	getClient : function() {},

	getUUID : function () {
		return cassandra.types.Uuid.random().toString();
    },
    
    getTimestamp : function(){
        return new Date()
	},
	
	_getInsertQuery: function(obj, schema_name){
        if (obj && obj instanceof Object) {
            var keys = Object.keys(obj);
            if (keys.length > 0){
            	var query = "INSERT INTO " + schema_name + " ";
	            var hintString = "(";
	            var qString = "(";
	            var values = [];
            	var len = keys.length;

            	for(var i = 0; i < len; i++) {
                    if (i == 0) {
                        hintString += keys[i];
                        qString += "?";
                    } else {
                        hintString += (", " + keys[i]);
                        qString += (", ?");
                    }
                    values.push(obj[keys[i]]);
            	}

            	var queryObject = {
            		queryString : query + hintString + ") VALUES " + qString + ")",
					queryValues : values
            	};
                return queryObject;
            }
        }
        return null;
	},
	
	_getUpdateQuery: function(id,obj, schema_name){
        if (obj && obj instanceof Object) {
            var keys = Object.keys(obj);
            if (keys.length > 0){
            	var query = "UPDATE " + schema_name + " ";
				var qString = "";
				var values = [];
            	var len = keys.length;
				for(var i = 0; i < len; i++){
					if(i==len-1){
						qString += keys[i] +"=?";
					}else{
						qString += keys[i] +"=?,"; 
					}
					values.push(obj[keys[i]]);
				} 
				values.push(id);
				var queryObject = {
					queryString : query + " SET "+qString+" where id= ?",
					queryValues: values
				};
				return queryObject;
            }
        }
        return null;
	},
	
	_findById: function(id,schema_name){
		var queryObject = {
			queryString : "Select * from " + schema_name + " where id=?",
			queryValues: [id]
		};
        return queryObject;
	},
	_findAll: function(schema_name){
		var queryObject = {
			queryString : "Select * from " + schema_name
		};
        return queryObject;
	},
	_findAllColumn: function(schema_name, columns){
		columns = columns || []
		var columnsName = ""
		for(let i=0; i<columns.length; i++){
			if(i>0){
				columnsName+=",";
			}
			columnsName += schema_name+"."+columns[i]
		}
		return columnsName.length > 1 ? columnsName : null;
	},
	_filterColumnAndFetch: function(schema_name, columns){
		var columnsName = ""
		columns = columns || []
		for(let i=0; i<columns.length; i++){
			if(!columns[i]){
				continue;
			}
			if(i>0){
				columnsName+=",";
			}
			columnsName += columns[i]
		}
		var queryObject = {
			queryString : `Select ${columnsName} from ${schema_name}`
		};
		return queryObject;
	},
	_deleteById: function(id,schema_name){
		var queryObject = {
			queryString : "Delete from " + schema_name + " where id=?",
			queryValues: [id]
		};
        return queryObject;
	},
	_findByKey: function(key, value, schema_name){
		var queryObject = {
			queryString : "Select * from " + schema_name + " where " + key + "=?",
			queryValues: [value]
		};
		return queryObject;
	},
	batch: function(batchQuery, callback){
		_performBatch(batchQuery, function(err){
			if(err){
				logger.error(err);
				return callback(false);
			}
			return callback(true);
		})
	}
}

function _performBatch(batchQuery, callback){
	dbPool.getConnection(function (err, connection) {
		if(err){
			logger.err(err);
			dbPool.releaseConnection(connection);
			return callback(err)
		}
		connection.beginTransaction(function(err){
			if (err) {
				throw err;
			}
			_performQueryAsync(connection, batchQuery, function(){
				dbPool.releaseConnection(connection);
				callback && callback();
			});
		});
	});
}

function _performQueryAsync(connection, queries, callback){
	var queryJson = queries.shift();
	if(!queryJson){
		connection.commit(function (err) {
			logger.info('Commiting transaction.....');
			if (err) {
				return connection.rollback(function () {
					throw err;
				});
			}
			logger.info('Transaction Complete.');
			connection.release();
			callback();
		});
		return;
	}
	var queryObj ={
		queryString: queryJson.query,
		queryValues: queryJson.params
	}

	function resolve(){
		_performQueryAsync(connection, queries, callback)
	}

	function reject(err){
		callback && callback(err);
	}

	_performQuery(connection, queryObj, resolve, reject)
}

function _performQuery(connection, queryObj, resolve, reject){
	connection.execute(queryObj.queryString, queryObj.queryValues, function(err, results, fields){
		if(err){
			logger.error(err);
			return connection.rollback(function() {
				throw err;
			});
		}
		return resolve();
	});
}

module.exports = MySqlDBORM;