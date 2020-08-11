const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { genreSchema } = require('./genres');


const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 50, trim: true},
    genre: { type: genreSchema, required: true},
    numberInStock: {type: Number },
    dailyRentalRate: { type: Number }
}));

function validateMovie(movie) {
    const schema = Joi.object({
      title: Joi.string().min(5).required(),
      genre: Joi.string().min(5).required(),
      numberInStock: Joi.number().min(5).required(),
      dailyRentalRate: Joi.number().min(5).required()
    });
    return schema.validate(movie);
  }

  exports.Movie = Movie;
  exports.validateMovie = validateMovie;