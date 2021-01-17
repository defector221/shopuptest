var express = require('express');
var ApiRouters = express.Router();
const bodyParser = require('body-parser')
const cors = require("cors");
const APIService = require('../services/APIService');

ApiRouters.use(cors());

ApiRouters.get('/lobby/all', async function(request, response, next){
    var apiService = new APIService(request);
    var responseObj = await apiService.getAll();
    response.json(responseObj);
});

ApiRouters.post('/lobby/create', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    await apiService.createNew(function(responseObj){
        response.json(responseObj);
    });
});

ApiRouters.post('/lobby/status', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    await apiService.updateLobbyStatus(function(responseObj){
        response.json(responseObj);
    });
});

ApiRouters.post('/lobby/fetch', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    var responseObj = await apiService.getLobbyDeclarativeDeatilsByID();
    response.json(responseObj);
});

ApiRouters.post('/lobby/add_member', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    await apiService.addMemberInLobby(function(responseObj){
        response.json(responseObj);
    });
});

ApiRouters.post('/lobby/contest/result', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    await apiService.updateLobbyResult(function(responseObj){
        response.json(responseObj);
    });
});

ApiRouters.post('/lobby/stats/all', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    var responseObj = await apiService.getAllStats();
    response.json(responseObj);
});


module.exports = ApiRouters;