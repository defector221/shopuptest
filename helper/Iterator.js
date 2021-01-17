function Iterator(values){
    this.values = values;
    this.keys = []; //used to iterate json
    this.index = -1;
    this.init();
}

Iterator.prototype = {
    init: function(){
        this.type = 0;
        if(Array.isArray(this.values)){
            this.type = 1;
            this.size = this.values.length;
        } else if(typeof this.values == "object"){
            this.type = 2;
            this.keys = Object.keys(this.values);
            this.size = this.keys.length;
        }
        if(!this.type){
            throw new Error('Can be intatiated');
        }
        return this;
    },

    hasNext: function(){
        return this.index < (this.size -1);
    },

    incr: function(){
        this.index = this.index + 1;
    },

    decr: function(){
        this.index = this.index - 1;
    },

    next: function(){
        this.incr();
        switch(this.type){
            case 1:
               return this.values[this.index];
            case 2:
                return new KeyEntry(this.keys[this.index] , this.values[this.keys[this.index]]);
            default:
                return null;
        }
    },

    hasPrevious: function(){
        return this.index >=1;
    }, 

    previous: function(){
        this.decr();
        switch(this.type){
            case 1:
               return this.values[this.index];
            case 2:
                return new KeyEntry(this.keys[this.index] , this.values[this.keys[this.index]]);
            default:
                return null;
        }
    }
}

function KeyEntry(key, value){
    this.key = key;
    this.value = value;
}

KeyEntry.prototype = {
    getKey: function(){
        return this.key;
    },
    getValue: function(){
        return this.value;
    }
}

module.exports = Iterator;