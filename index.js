const express = require("express");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./models/movies");
const home = require("./routes/home");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/genre-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb"))
  .catch(() => console.error("could not connect to mongodb"));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/", home);
app.use("/api/customers", customers);
app.use("/api/movies", movies);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
