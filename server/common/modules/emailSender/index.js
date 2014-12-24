var nodemailer = require("nodemailer"),
    _ = require("underscore"),
    Q = require('q'),
    logger = require("common/core/logs")(module),
    config = require("config");

function EmailSender(data){
    this.data = data;
    this.init();
}
_.extend(EmailSender.prototype, {

    init: function(){
        this.smtpTransport = nodemailer.createTransport({
            service: config.get("emailSender:service"),
            auth: {
                user: config.get("emailSender:auth:user"),
                pass: config.get("emailSender:auth:pass")
            }
        });

        this.mailOptions = {
            from: this.data.from || config.get("email:default:from"), // sender address
            to: this.data.to || config.get("email:list").join(','), // list of receivers
            subject: this.data.subject || config.get("email:default:subject") // Subject line
        }

        if( this.data.text ){
            this.mailOptions.text = this.data.text;
        }else if( this.data.body ){
            this.mailOptions.body = this.data.body;
        }else if( this.data.html ){
            this.mailOptions.html = this.data.html;
        }else{
            this.mailOptions.text = "no text or body...";
        }

    },

    send: function(){
        var _this = this;
        var def = Q.defer();
        this.smtpTransport.sendMail(this.mailOptions, function(err, response){
            if(err){
                logger.error('error', err);
                def.reject(err);
            }else{
                def.resolve();
                logger.log('info', "Message sent");
            }

            // if you don't want to use this transport object anymore, uncomment following line
            _this.smtpTransport.close();
        });
        return def.promise;
    }

});

module.exports = EmailSender;