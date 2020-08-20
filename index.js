require("express-async-errors");
require("winston-mongodb");
const express = require("express");
const app = express();
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const config = require("config");
const error = require("./middleware/error");
const winston = require("winston");
const mongoose = require("mongoose");


winston.exceptions.handle(
  new winston.transports.File({ filename: 'exceptions.log'})
);

wwinston.rejections.handle(
  new winston.transports.File({ filename: 'rejections.log' })
);

winston.add(winston.transports.File, {filename: "logfile.log"} );
winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vivid"});

if (!config.get("jwtkey")) {
  console.error("FATAL ERROR: jwtkey is not defined ");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vivid", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb"))
  .catch(() => console.error("could not connect to mongodb"));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
