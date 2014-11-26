module.exports = function(req, res, next){
    var def = {
        resolve: function () {}
    };
    next(req, res, next, def);
};