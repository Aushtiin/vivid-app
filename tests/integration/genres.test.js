const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("Get /", () => {
    it("should return genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("Get /:id", () => {
    it("should return a given genre", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return a 404 if id is invalid", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });
  });

  describe("Post /", () => {
    let token;
    let name;

      const exec = async () => {
        return await request(server)
        .post("/api/genres")
        .set('x-auth-token', token)
        .send({ name });
      }

      beforeEach(() => {
        token = new User().generateAuthToken();
        name = 'genre1'
      })

    it("it should return a 401 if client is not logged in", async () => {
        token = '';

        const res = await exec()

      expect(res.status).toBe(401);
    });

    it("it should return a 400 if genre is less than 5 characters", async () => {
      name = '1234'
      
        const res = await exec ()

      expect(res.status).toBe(400);
    });

    it("it should return a 400 if genre is more than 50 characters", async () => {
        name = new Array(52).join('a');

      const res = await exec()

      expect(res.status).toBe(400);
    });

    it("it should save if genre is valid", async () => {
        await exec();

        const genre = await Genre.find({name: 'genre1'})

      expect(genre).not.toBe(null);
    });

    it("it should save if genre is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});
