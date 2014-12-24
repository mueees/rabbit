var logger = require('common/core/logs')(module),
    EmailSender = require("common/modules/emailSender"),
    Q = require("q"),
    config = require("config"),
    rootPath = "../..",
    jade = require('jade');

function worker(emailSettings, done) {

    /*todo: add validation for emailSettings*/

    emailSettings.template = rootPath + emailSettings.template;

    function makeHtml(){
        return jade.renderFile(emailSettings.template, emailSettings.data);
    }

    function send(){
        var def = Q.defer();
        var emailSender = new EmailSender( emailSettings );
        emailSender.send(function(err){
            if(err){
                return def.reject(err);
            }
            def.resolve(err);
        });
        return def.promise;
    }

    function execute(){
        emailSettings.html = makeHtml();
        send().then(function () {
            done();
        }, function (err) {
            done(err);
        });
    }

    execute();

};
module.exports = worker;