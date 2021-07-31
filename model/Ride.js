const { UUID } = require('../helper/Utils');

module.exports = class Ride {
    constructor(rideOfferByUserID, offeringByName, origin, destination, available_seats, vehicle_id, vehicle_name ) {
        this.rideOfferByUserID = rideOfferByUserID;
        this.vehicle_id = vehicle_id;
        this.origin = origin;
        this.destination = destination;
        this.id = UUID();
        this.offeringByName = offeringByName;
        this.available_seats = available_seats;
        this.state = 'STARTED';
        this.vehicle_name = vehicle_name;
    }

    get() {
        return this;
    }

    getVehicleID(){
        return this.vehicle_id;
    }

    getAvailableSeat(){
        return this.available_seats;
    }

    getSourceStation(){
        return this.origin;
    }

    getDestination(){
        return this.destination;
    }

    getToken(){
        return `${this.getSourceStation()}::${this.getDestination()}`;
    }

    getRideID(){
        return this.id;
    }

    stop(){
        return this.state = 'COMPLETED';
    }

    isSeatAvailable(seats){
        return this.available_seats >= seats;
    }
    
    isFullfilledBySelectionStrageny(selection_strategy, vechile){
        if(selection_strategy == 'Preferred Vechile'){
            if(vechile == vehicle_name){
                return true;
            }
        }else{
            return (this.available_seats == 2)
        }
        return false; 
    }
}