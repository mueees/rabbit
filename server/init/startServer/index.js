/*
* 1. add feeds from json to system
* */

var dbHelpers = require("common/helpers/db");
var initFeeds = require("./initFeeds/init.feeds");
var initUser = require("./initUser/init.user");

dbHelpers.db.clearDb().then(function () {
    initFeeds().then(function () {
        initUser().then(function () {
            console.log("Init script done.");
            process.exit();
        });
    });
});