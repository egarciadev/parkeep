var assert = require('assert');

exports.isObject = function(){
    return function (e, res, body) {
        assert.isObject(body);
    };
}

exports.validObj = function(vo){
    return function (e, res, body) {
        var vo_keys = Object.keys(vo);
        vo_keys.forEach(function(key){
            assert.include (body, key);
        });
    };
}

exports.assertService = function(url){
    return function (e, res, body) {
        assert.equal (body.service, url);
    };
}

exports.assertMsj = function(msj){
    return function (e, res, body) {
        assert.equal (body.msj, msj);
    };
}

exports.assertStatus = function(status){
    return function (e, res, body) {
        assert.equal (body.status, status);
    };
}

exports.assertEmptyObj = function(){
    return function (e, res, body) {
        assert.isEmpty (body.obj);
    };
}

exports.assertArrayObj = function(key){
    return function (e, res, body) {
        
        assert.isObject(body.obj);
        assert.isArray(body.obj[key]);
        body.obj[key].forEach(function(i){
           assert.isObject(i);
        })
    };
}

exports.log = function(){
    return function (e, res, body) {
        console.log(body);
        console.log(body.obj);
        console.log(body.obj.documento_temporal);
    };
}
