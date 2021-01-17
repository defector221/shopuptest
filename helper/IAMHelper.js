const Crypto = require('crypto-js');
var DEFAULT_ENCRYPTION_KEY = "iuhgfdxzxcvbnhgfe34567sdfghny~!@#$";
var DEFAULT_ENCRYPTION_ALGORITHM = "DEFAULT";

class Config{
    constructor(){
        this.update({});
    }

    update(options) {
        this.token = options.encrytionKey || DEFAULT_ENCRYPTION_KEY;
        this.algo = options.algorithm || DEFAULT_ENCRYPTION_ALGORITHM;
    }

    getToken() {
        return this.token;
    }

    getAlgorithm() {
        return this.algo;
    }
}

function Adapter() { }

Adapter.getFactory = function (algo) {
    switch (algo) {
        case "AES":
            return AESEncryption;
        default:
            return DefaultEncrption;
    }
}

function _build(){
    this.crypto = Adapter.getFactory(this.config.getAlgorithm()).getInstance(this.config);
}

class Encryption{
    constructor(config){
        this._config = config;
        this.init();
    }

    init(){}
}

Encryption.getInstance = function (config) {
    var $$ = this;
    return new $$(config);
}

class AESEncryption extends Encryption{
    constructor(config){
        super(config);
    }

    init(){
        this.key = Crypto.enc.Base64.parse(this._config.getToken());
        this.iv = Crypto.enc.Base64.parse('                      ');
    }

    encrypt(plainText) {
        return Crypto.AES.encrypt(plainText, this.key, this.iv).toString();
    }

    decrypt(ciperText) {
        return Crypto.AES.decrypt(ciperText, this.key, this.iv).toString(CryptoJS.enc.Utf8);
    }
}

class DefaultEncrption extends Encryption{
    constructor(config){
        super(config);
    }

    encrypt(plainText) {
        return Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(plainText));
    }

    decrypt(ciperText) {
        var ciperTextArray = Crypto.enc.Base64.parse(ciperText);
        return ciperTextArray.toString(Crypto.enc.Utf8);
    }
}

module.exports = class IAM{
    constructor(){
        this.init();
    }

    init() {
        this.config = new Config();
        _build.call(this);
    }

    encrypt(plaintext) {
        return this.crypto.encrypt(plaintext);
    }

    decrypt(ciperText) {
        return this.crypto.decrypt(ciperText);
    }
};

