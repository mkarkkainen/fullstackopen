const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper.js");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
}, 100000);

describe("general", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 100000);

  test("unique identifier is id", async () => {
    const response = await helper.blogsInDb();

    const blogToCheck = response[0];

    expect(blogToCheck.id).toBeDefined();
  });
});

describe("creating", () => {
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
  }, 100000);

  test("new post missing url or title", async () => {
    const newPost = {
      author: "Rick",
    };

    await api.post("/api/blogs").send(newPost).expect(400);
  });
});

describe("removing", () => {
  test("delete a blog post succesfully", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const contents = blogsAtEnd.map((x) => x.title);

    expect(contents).not.toContain(blogToDelete.content);
  });
});

describe("editing", () => {
  test("editing a post succesfully", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToEdit = blogsAtStart[1];

    const newBlog = {
      title: blogToEdit.title,
      author: blogToEdit.author,
      url: blogToEdit.url,
      likes: 69420,
    };
    await api.put(`/api/blogs/${blogToEdit.id}`).send(newBlog).expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const blogToEditEnd = blogsAtEnd[1];

    expect(blogToEditEnd.likes).not.toBe(blogToEdit.likes);
  }, 100000);
});
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
