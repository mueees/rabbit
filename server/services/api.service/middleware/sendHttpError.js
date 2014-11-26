module.exports = function(req, res, next){
    res.sendError = function(error){
        res.status( error.status );
        if( req.headers['x-requested-with'] == "XMLHttpRequest" ){
            res.send({
                message: error.message
            });
        }else{
            res.send( error.message );
        }
    };
    next();
};