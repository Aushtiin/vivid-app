const express = require("express");
const app = express();
const Joi = require("@hapi/joi");
const genres = require('./routes/genres');
const home = require('./routes/home');

app.use(express.json());;
app.use('/api/genres', genres);
app.use('/', home);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
