const { UUID } = require('../helper/Utils');

module.exports = class User {
    constructor(name, age, gender, id) {
        this.uName = name;
        this.uAge = age;
        this.uGender = gender;
        this.user_id = id || UUID();
        this.offered = 0
        this.taken = 0
    }

    get() {
        return this;
    }

    getName(){
        return this.uName;
    }

    getAge(){
        return this.uAge;
    }

    getGender(){
        return this.uGender;
    }

    getID(){
        return this.user_id;
    }

    offeredRide(){
        this.offered++;
    }

    takenRide(){
        this.taken++;
    }
}