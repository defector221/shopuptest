'use strict';

const fs = require('fs');
const logger = require('./logger');
const Ride = require('./model/Ride');
const User = require('./model/User');
const Vehicle = require('./model/Vehicle');
var bookMap =  new Map();

var availableRides = new Map();
var availableRidesByID = new Map();

var UserMap = new Map();
var DriverVehicleMap = new Map();
var VechileMap = new Map();

var SourceStationVechile = new Map();

class RidesContainer{

    static addUser(user_name, gender, age){
        let user = new User(user_name, age, gender);
        this.setUser(user.getID(), user);
        return user;
    }

    static addVehicle(name, vehicle_number, user_id, state = 'INITIAL'){
        let veichle = new Vehicle(name, vehicle_number, user_id, state);
        this.setVehicle(veichle.getID(), veichle);
        return veichle;
    }

    static setUser(user_id, userObj){
        UserMap.set(user_id, userObj);
    }

    static setVehicle(vechile_id, veichle){
        let vehileMapAry = DriverVehicleMap.get(veichle.getUserID()) || [];

        for(let availableVeichle of vehileMapAry){
            if(availableVeichle.getID() == vechile_id){
                throw new Error('Duplicate Vechile Details');
            }
        }

        vehileMapAry.push(vechile_id);
        VechileMap.set(vechile_id, veichle);
        DriverVehicleMap.set(veichle.getUserID(), vehileMapAry);
    }

    static getVehicleByRCNumber(rcNumber){
        let vehicles = Object.values(VechileMap);
        for(let index=0; index<vehicles.length; index++){
            if(vehicles[index].getVehicleNumber().trim() == rcNumber.trim()){
                return vehicles[index];
            }
        }

        return null;
    }

    static getUserByID(id){
        return UserMap.get(id);
    }


    static offerRide(id, name, origin, destination, availableSeats, Vechile){
        let vechile_number = (Vechile.split(",")[1]).trim();
        let vechile = this.getVehicleByRCNumber(vechile_number);

        if(vechile == null){
            throw new Error('Vehicle Details is invalid');
        }

        if(!vechile.isAvailableForOffer()){
            throw new Error('A Ride has already offered by this user for the vehicle');
        }

        let ride =  new Ride(id, name, origin, destination, availableSeats, vechile.getID(), Vechile.split(",")[0])
        availableRides.set(ride.getToken(), ride);
        availableRidesByID.set(ride.getID(), ride);
        
        let availableRidesAtSource =  SourceStationVechile.get(origin) || [];
        availableRidesAtSource.push(ride)

        SourceStationVechile.set(origin, availableRidesAtSource);

        this.getUserByID(id).offeredRide();
        vechile.rideOffered();

        return ride;
    }

    static selectRide(id, origin, destination, seats, vechile, selection_strategy){
       let rides =  this.getRidesIfPossible(origin, destination, seats, vechile, selection_strategy);
       if(rides.length >= 1){
           UserMap.get(id).takenRide();
       }
       return {
           status: rides.length >=1,
           rides
       }
    }

    static endRide(ride_id){
        let ride = availableRidesByID.get(ride_id);
        if(!ride){
            throw new Error('Unable To End Ride Due to unavailability');
        }
        ride.stop();
        VechileMap.get(ride.getVehicleID()).completedRide();
        availableRidesByID.delete(ride.getID());
        availableRides.delete(ride.getToken());

        let availableRidesAtSource =  SourceStationVechile.get(ride.getSourceStation()) || [];
        SourceStationVechile.set(ride.getSourceStation(), availableRidesAtSource.filter(function(currentRide){
            return currentRide.getID() != ride.getID()
        }));
        return {
            status: true,
            ride_id: `Ride ${ride_id} is successfully stopped`
        }
    }

    static getRidesIfPossible(origin, destination, seats, vechile, selection_strategy){
        let rides = [];
        let directRide = availableRides.get(`${origin}::${destination}`);
        if(directRide && directRide.isSeatAvailable(seats) && directRide.isFullfilledBySelectionStrageny(selection_strategy, vechile)){
            rides.push(directRide);
        }else{
            //finding indirect ride
            rides = _getIndirectRides(origin, []);
        }

        function _getIndirectRides(source, rides){
            let possibleRidesSourceRides = SourceStationVechile(source);

            for(let index=0; index<possibleRidesSourceRides.length; index++){
                let currentRide = possibleRidesSourceRides[i];

                if(!(currentRide.isSeatAvailable(seats) && currentRide.isFullfilledBySelectionStrageny(selection_strategy, vechile))){
                    continue;
                }

                rides.push(currentRide);
                
                if(currentRide.getDestination() == destination){
                    return {rides, completed: true};
                }

                let intemidaiteRides = _getIndirectRides(currentRide.getDestination(), rides);
                if(!intemidaiteRides.completed){
                    intemidaiteRides.rides.pop();
                    rides = intemidaiteRides.rides;
                }
                
            }
            return {rides, completed: false};
        }
    }

    static getSummary(){
        let summery = {}
        if(Object.values(UserMap).length == 0){
            return {message: "No Information Available"}
        }

        Object.values(UserMap).forEach(function(user){
            summery[`${summery.getName()}`] = `${user.taken} taken ${user.offered} offered`
        })
        return summery;
    }
}

module.exports = RidesContainer;
