const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("./test_helper.js");

describe("with one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passHash = await bcrypt.hash("show123", 10);
    const user = new User({ username: "admin", password: passHash });
    await user.save();
  }, 100000);

  test("creation succeeds with a new user with all fields", async () => {
    const usersAtStart = await helper.usersInDb();
    const user = {
      username: "Reidas_7000",
      name: "Rei Rei",
      password: "woof123",
    };

    await api
      .post("/api/users")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(user.username);
  }, 100000);

  test("creation fails properly when username is already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const user = {
      username: "admin",
      name: "Lons",
      password: "woof123",
    };

    const result = await api
      .post("/api/users")
      .send(user)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  }, 100000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
