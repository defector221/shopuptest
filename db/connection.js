var mysql  = require('mysql2');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/databaseConfig.json')[env];
const logger = require('../logger');

const dbPool = mysql.createPool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    port: config.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

global.dbPromisePool = dbPool.promise();
global.dbPool = dbPool;
try{
    dbPool.getConnection(function (err, connection) {
		if(err){
			logger.error(err);
			dbPool.releaseConnection(connection);
        }
        logger.info("connection established");
        dbPool.releaseConnection(connection);
	});
}catch(err){
    logger.error(err);
}