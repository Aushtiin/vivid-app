const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { genreSchema } = require('./genres');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 50, trim: true},
  genre: { type: genreSchema, required: true},
  numberInStock: {type: Number, required: true, min: 0, max: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
      title: Joi.string().min(5).required(),
      genre: Joi.string().min(5).required(),
      numberInStock: Joi.number().min(0).required(),
      dailyRentalRate: Joi.number().min(0).required()
    });
    return schema.validate(movie);
  }

  exports.Movie = Movie;
  exports.validateMovie = validateMovie;
  exports.movieSchema = movieSchema;