const axios = require('axios');

function HTTPOpenRequest(baseURL){
    this.baseURL = baseURL
}

HTTPOpenRequest.prototype = {
    openConnection: function(url){
        this.url = url
        return this;
    },
    setRequestMethod: function(method){
        this.method = method;
        return this;
    },
    setRequestHeader: function(headers){
        this.headers = headers;
        return this;
    },
    send: function(postBody){
        return axios({
            url: this.url,
            method : this.method,
            data: postBody || null,
            headers: this.headers || null,
            timeout:1000,
            proxy:{
                host: '127.0.0.1',
                port: 9000
            }
        });
    }
}


HTTPOpenRequest.Method = {
    POST:'POST',
    GET:'GET',
    DELETE:'DELETE',
    OPTIONS:"OPTIONS"
}

module.exports = HTTPOpenRequest;