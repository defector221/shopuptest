const BaseService = require('./BaseService');
const RIDES_CONTAINER = require('../Rides.Container');

module.exports = class Service extends BaseService{
    constructor(request){
        super(request);
    }

    async addNewUser(){
        try{
            let user = RIDES_CONTAINER.addUser(this.props.name, this.props.age, this.props.gender);
            return {
                user,
                status: true
            }
        }catch(err){
            return {
                status: false,
                message: err.message
            }
        }
    }

    async addVeichle(){
        try{
            let veichle = RIDES_CONTAINER.addVehicle(this.props.name, this.props.vehicle_number, this.props.user_id);
            return {
                veichle,
                status: true
            }
        }catch(err){
            return {
                status: false,
                message: err.message
            }
        }
    }

    async offerNewRide(){
        try{
            let ride = RIDES_CONTAINER.offerRide(this.props.id, this.props.name, this.props.origin, this.props.destination, this.props.availableSeats, this.props.vehicle);
            return {
                ride,
                status: true
            }
        }catch(err){
            return {
                status: false,
                message: err.message
            }
        }
        
    }

    async selectRide(){
        try{
            let rides = RIDES_CONTAINER.offerRide(this.props.id, this.props.origin, this.props.destination, this.props.seats, this.props.vehicle, this.props.selection_strategy);
            return rides
        }catch(err){
            return {
                status: false,
                message: err.message
            }
        }
    }

    async endRide(){
        try{
            let rides = RIDES_CONTAINER.endRide(this.props.id);
            return rides
        }catch(err){
            return {
                status: false,
                message: err.message
            }
        }
    }

    async getSummary(){
        try{
            let rides = RIDES_CONTAINER.getSummary();
            return rides
        }catch(err){
            return {
                status: false,
                message: err.message
            }
        }
    }
}

