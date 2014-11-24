var Q = require('q');

function b() {
    var def = Q.defer();
    setTimeout(function () {
        def.reject(new Error('b'))
    },  1500);
    return def.promise;
}

function a() {
    var def = Q.defer();
    setTimeout(function () {
        def.resolve('a')
    },  2000);
    return def.promise;
}

var aPromise = a();
var bPromise = b();

Q.all([aPromise, bPromise]).then(function () {
    console.log('done');
}, function () {
    console.log('error');
    return new Error('b');
}).then(function (data) {
    console.log(data);
    console.log('done 2');
}, function () {
    console.log('error 2');
});