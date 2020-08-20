const winston = require("winston/lib/winston/config");

module.exports = function ( error, req, res, next) {
    winston.error(err.message, err)
    res.status(500).send("Something went wrong");
}