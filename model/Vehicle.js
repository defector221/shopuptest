const { UUID } = require('../helper/Utils');

module.exports = class Vehicle {
    constructor(name, vehicle_number, user_id, state, id) {
        this.vName = name;
        this.rc_number = vehicle_number;
        this.vechile_id = id || UUID();
        this.user_id = user_id;
        this.state = state;
    }

    get() {
        return this;
    }

    getVehicleName(){
        return this.vName;
    }

    getVehicleNumber(){
        return this.rc_number;
    }

    getUserID(){
        return this.user_id;
    }

    getID(){
        return this.vechile_id;
    }

    isAvailableForOffer(){
        return this.state == 'INITAIL' || this.state == 'COMPLETED';
    }

    rideOffered(){
        this.state == 'STARTED';
    }

    completedRide(){
        return this.state == 'COMPLETED';
    }
}