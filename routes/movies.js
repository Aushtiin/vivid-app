const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Movie, validateMovie } = require("../models/movies");
const { Genre } = require("../models/genres");
const validate = require("../middleware/validate");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.post("/", validate(validateMovie), async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Invalid genre");

  const movie = new Movie({
    title: req.body.title,
    genre: {
        name: genre.name,
        _id: genre._id
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
 await movie.save();
  res.send(movie);
});

router.put("/:id", validate(validateMovie), async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { genre: req.body.genre },
    { numberInStock: req.body.numberInStock },
    { dailyRentalRate: req.body.dailyRentalRate },
    { new: true }
  );

  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send("Movie not found");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id)

    if ( !movie ) return res.status(404).send("Movie not found")

    res.send(movie)
})

module.exports = router;