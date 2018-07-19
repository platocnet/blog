var settings = require("../settings"),
    blog_db = require("mongodb").Db,
    connection = require("mongodb").Connection,
    Server = require("mongodb").Server;

module.exports = new blog_db(settings.db, new Server(settings.host, settings.port),
{safe: true});
