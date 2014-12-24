module.exports = function(req, res, next){
    res.finish = {
        resolve: function () {}
    };
    next();
};