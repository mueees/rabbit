var nconf = require("nconf");
var path = require("path");
var configFile;

var node_site = process.env.NODE_ENV;

if((node_site == 'development')){
    configFile = 'development.json'
}else if(node_site == 'live'){
    configFile = 'live.json'
}

nconf.file('main', {file: path.join(__dirname, 'main.json')});
nconf.file('configFile', {file: path.join(__dirname, configFile)});

module.exports = nconf;