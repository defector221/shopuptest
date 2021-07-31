var express = require('express');
var ApiRouters = express.Router();
const bodyParser = require('body-parser')
const cors = require("cors");
const APIService = require('../services/APIService');

ApiRouters.use(cors());

ApiRouters.post('/add_user', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    var responseObj = await apiService.addNewUser();
    response.json(responseObj);
});

ApiRouters.post('/add_vechile', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    var responseObj =  await apiService.addVeichle()
    response.json(responseObj);
});

ApiRouters.post('/offer_ride', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    var responseObj  = await apiService.offerNewRide();
    response.json(responseObj);
});

ApiRouters.post('/select_ride', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    var responseObj  = await apiService.selectRide();
    response.json(responseObj);
});

ApiRouters.post('/end_ride', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    var responseObj  = await apiService.endRide();
    response.json(responseObj);
});

ApiRouters.get('/summery', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(request, response, next){
    var apiService = new APIService(request);
    var responseObj  = await apiService.getSummary();
    response.json(responseObj);
});

module.exports = ApiRouters;