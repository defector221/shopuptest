const logger = require('../logger');
const BaseService = require('./BaseService');
const Iterator = require('../helper/Iterator');
var MySqlDBORM = require('../cassendra/CassendraDB');
var MySqlDBORMObj = new MySqlDBORM();
const ENV_CONFIG = require('../Global.Constants');
const { UUID } = require('../helper/Utils');

module.exports = class Service extends BaseService{
    constructor(request){
        super(request);
    }

    async getAll() {
        var queryObj = MySqlDBORMObj._findAll(ENV_CONFIG.DB.LOBBY);
        var limit = this.props.limit || 40;
        var offset = this.props.offset || 0;
        queryObj.queryString = `${queryObj.queryString} ORDER BY ${ENV_CONFIG.DB.LOBBY}.created DESC LIMIT ${offset},${limit}`;
        logger.info(queryObj.queryString);
        var lobbyList = [];
        if (queryObj) {
            try {
                var [rows] = await dbPromisePool.query(queryObj.queryString);
                var it = new Iterator(rows);
                while (it.hasNext()) {
                    var row = it.next();
                    lobbyList.push(row);
                }
                if (lobbyList) {
                    return { status: true, lobbies: lobbyList };
                }

            } catch (err) {
                logger.error("Exception: ", err);
            }
        }
        return { status: false }
    }

    async createNew(callback){
        var id = UUID();
        var queryObj = MySqlDBORMObj._getInsertQuery({
            lobby_name: this.props.lobby_name,
            lobby_total_member_alloted_seats: this.props.max_persons || "",
            entry_fee_per_seat: this.props.entry_fee || "",
            created: MySqlDBORMObj.getTimestamp(),
            id
        }, ENV_CONFIG.DB.LOBBY);
        if (queryObj) {
            try {
                await dbPromisePool.execute(queryObj.queryString, queryObj.queryValues);
                return callback({ status: true, id })
            } catch (err) {
                logger.error("Exception", err);
                return callback({ status: false });
            }
        } else {
            return callback({ status: false })
        }
        
    }

    async updateLobbyStatus(callback){
        var queryObj = MySqlDBORMObj._getUpdateQuery(this.props.id,{
            lobby_status: this.props.status
        }, ENV_CONFIG.DB.LOBBY);
        if (queryObj) {
            try {
                await dbPromisePool.execute(queryObj.queryString, queryObj.queryValues);
                return callback({ status: true})
            } catch (err) {
                logger.error("Exception", err);
                return callback({ status: false });
            }
        } else {
            return callback({ status: false })
        }
    }

    async getLobbyDeclarativeDeatilsByID(){
        var query = `select m.id as candidate_id , m.first_name, m.last_name, m.ticket_id from Members m inner join Tickets t on
        m.ticket_id = t.id inner join Lobby l on 
        l.id = t.lobby_id where l.id='${this.props.id}'`

        var lobbyQuery = MySqlDBORMObj._findById(this.props.id, ENV_CONFIG.DB.LOBBY);
        if (query) {
            try {
                var result = {};
                var [rows] = await dbPromisePool.execute(lobbyQuery.queryString,lobbyQuery.queryValues);
                result.lobby_details = rows[0];

                var [rows] =  await dbPromisePool.query(query);
                var it = new Iterator(rows);
                var details = [];
                while (it.hasNext()) {
                    var row = it.next();
                    details.push(row);
                }
                result.members = details;
                return { status: true, details: result };
            } catch (err) {
                logger.error("Exception", err);
            }
        } 
        return { status: false }
    }

    async addMemberInLobby(callback){
        var id = UUID();
        var queryObj = MySqlDBORMObj._getInsertQuery({
            cost: this.props.mCost,
            lobby_id: this.props.id,
            sold: 1,
            purchase_date: MySqlDBORMObj.getTimestamp(),
            id
        }, ENV_CONFIG.DB.TICKETS);

        if (queryObj) {
            try {
                var queries = [{
                    query: queryObj.queryString,
                    params: queryObj.queryValues
                }];

                var memberQuery = MySqlDBORMObj._getInsertQuery({
                    first_name: this.props.mFirstName,
                    last_name: this.props.mLastName,
                    phone: this.props.mPhone,
                    email: this.props.mEmail,
                    address: this.props.mAddress,
                    ticket_id: id,
                    created: MySqlDBORMObj.getTimestamp(),
                    id:UUID()
                }, ENV_CONFIG.DB.MEMBERS);

                queries = queries.concat({
                    query:memberQuery.queryString,
                    params:memberQuery.queryValues
                });

                MySqlDBORMObj.batch(queries, function (status) {
                    if (status) {
                        logger.info("News uploaded successfully wih id:" + id);
                        return callback({ status: true, id });
                    } else {
                        return callback({ status: false });
                    }
                })
            }catch(err){
                logger.error("Exception", err);
                return callback({ status: false });
            }
        }
    }

    async updateLobbyResult(callback){
        var id = UUID();
        var queryObj = MySqlDBORMObj._getUpdateQuery(this.props.id,{
            lobby_status: this.props.status
        }, ENV_CONFIG.DB.LOBBY);

        if (queryObj) {
            try {
                var queries = [{
                    query: queryObj.queryString,
                    params: queryObj.queryValues
                }];

                var winnerQuery = MySqlDBORMObj._getInsertQuery({
                    ticket_id: this.props.ticket_id,
                    amount: this.props.amount,
                    paid: 1,
                    claimed: 1,
                    draw_date: MySqlDBORMObj.getTimestamp(),
                    id
                }, ENV_CONFIG.DB.WINNERS);

                var statsQuery = MySqlDBORMObj._getInsertQuery({
                    ticket_id: this.props.ticket_id,
                    lobby_id: this.props.id,
                    cuts: this.props.cuts,
                    draw_date: MySqlDBORMObj.getTimestamp(),
                    id: UUID()
                }, ENV_CONFIG.DB.STATS);

                queries = queries.concat({
                    query:winnerQuery.queryString,
                    params:winnerQuery.queryValues
                }).concat({
                    query:statsQuery.queryString,
                    params:statsQuery.queryValues
                });

                logger.info("queries",queries);

                MySqlDBORMObj.batch(queries, function (status) {
                    if (status) {
                        return callback({ status: true });
                    } else {
                        return callback({ status: false });
                    }
                })
            }catch(err){
                logger.error("Exception", err);
                return callback({ status: false });
            }
        }
    }

    async getAllStats(){
        var winnerObj = MySqlDBORMObj._findAll(ENV_CONFIG.DB.WINNERS);
        var statsObj = MySqlDBORMObj._findAll(ENV_CONFIG.DB.STATS);

        var result = {
            cuts: [],
            prize: [],
            categories: []
        };
        if (winnerObj && statsObj) {
            try {
                var [rows] = await dbPromisePool.query(winnerObj.queryString);
                var winnerIt = new Iterator(rows);
                while (winnerIt.hasNext()) {
                    let row = winnerIt.next();
                    result.prize.push(row.amount);
                    result.categories.push(row.ticket_id);
                }

                var [rows] = await dbPromisePool.query(statsObj.queryString);
                var statsObjIt = new Iterator(rows);
                while (statsObjIt.hasNext()) {
                    let row = statsObjIt.next();
                    result.cuts.push(row.cuts);
                }

                return { status: true, result: result };

            } catch (err) {
                logger.error("Exception: ", err);
            }
        }
        return { status: false }
    }
}

