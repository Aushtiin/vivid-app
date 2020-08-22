const winston =require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'exceptions.log'})
      );
      
      winston.rejections.handle(
        new winston.transports.File({ filename: 'rejections.log' })
      );
      
      winston.add(winston.transports.File, {filename: "logfile.log"});
      winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vivid"});
};