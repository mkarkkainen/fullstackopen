const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper.js");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
}, 100000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("unique identifier is id", async () => {
  const response = await helper.blogsInDb();

  const blogToCheck = response[0];

  expect(blogToCheck.id).toBeDefined();
});

test("post req works and creates new blog post", async () => {
  const newPost = {
    title: "Testing a new post",
    author: "Jesus",
    url: "http://cleancoder.com/",
  };

  await api.post("/api/blogs").send(newPost).expect(201);
  const newBlogs = await api.get("/api/blogs");
  expect(newBlogs.body).toHaveLength(helper.initialBlogs.length + 1);
}, 100000);

test("new post missing likes defaults to zero", async () => {
  const newPost = {
    author: "steve",
    url: "someurl.com",
    title: "sometitle",
  };

  await api.post("/api/blogs").send(newPost).expect(201);

  const newBlogs = await helper.blogsInDb();
  const lastOne = newBlogs.at(-1);
  expect(lastOne.likes).toBe(0);
});

test("new post missing title or url returns 400 bad request", async () => {
  const badPost = {
    author: "Jesus",
  };

  await api.post("/api/blogs").send(badPost).expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});
