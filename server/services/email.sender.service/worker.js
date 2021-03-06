var logger = require('common/core/logs')(module),
    EmailSender = require("common/modules/emailSender"),
    Q = require("q"),
    config = require("config"),
    rootPath = "../..",
    jade = require('jade');

function worker(task, done) {

    var emailSettings = task.data;

    /*todo: add validation for emailSettings*/

    emailSettings.template = rootPath + emailSettings.template;

    function makeHtml(){
        return jade.renderFile(emailSettings.template, emailSettings.data);
    }

    function send(){
        return new EmailSender( emailSettings ).send();
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