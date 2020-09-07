const moment = require('moment');
let server;
const { Rental } = require("../../models/rentals");
const mongoose = require("mongoose");
const request = require('supertest');
const { User } = require("../../models/users");
const { Movie } = require('../../models/movies');

describe("/api/returns", () => {
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const exec = () => {
    return request(server)
    .post('/api/returns')
    .set('x-auth-token', token)
    .send({customerId, movieId})
  }

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
        _id: movieId,
        title: 'luthor',
        dailyRentalRate: 2,
        genre: '12345',
        numberInStock: 10
    });
    await movie.save()

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "luthor",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "luthor",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it('should return 401 if client is not logged in',async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  })

  it('should return a 400 if customerid is not provided', async () => {
    customerId = '';

    const res = await exec();

      expect(res.status).toBe(400)
  })

  it('should return a 400 if movieid is not provided', async () => {
    movieId = '';

    const res = await exec();
    
      expect(res.status).toBe(400)
  })

  it('should return a 404 if rental is not found', async () => {
    await Rental.remove({})

    const res = await exec();

      expect(res.status).toBe(404);
  })

  it('should return a 400 if return is already processed', async () => {
    rental.dateReturned = new Date()
    await rental.save()

    const res = await exec();

      expect(res.status).toBe(400);
  })

  it('should return a 200 if request is valid', async () => {
    const res = await exec();

      expect(res.status).toBe(200);
  })

  it('should set a return date if request is valid', async () => {
    const res = await exec();

    const rentalInDt = await Rental.findById(rental._id)

    const diff = new Date() - rentalInDt.dateReturned

      expect(diff).toBeLessThan(10 * 1000);
  })

  it('should set a rental fee if input is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();
    
    const res = await exec();

    const rentalInDt = await Rental.findById(rental._id)

      expect(rentalInDt.rentalFee).toBe(14)
  })

  it('should increase the numberInStock', async () => {
    const res = await exec();

    const movieInDt = await Movie.findById(movieId)

      expect(movieInDt.numberInStock).toBe(movie.numberInStock + 1);
  })

  it('should return rental if input is valid', async () => {
    const res = await exec();

    const rentalInDt = await Rental.findById(rental._id)
    expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer']))
  })
});
