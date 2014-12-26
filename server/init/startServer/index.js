/*
* 1. add feeds from json to system
* */

var dbHelpers = require("common/helpers/db");
var initFeeds = require("./initFeeds/init.feeds");

dbHelpers.db.clearDb().then(function () {
    initFeeds().then(function () {
        console.log("Init script done.");
        process.exit();
    });
});