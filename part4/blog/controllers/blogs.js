const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (body.title === undefined || body.url === undefined) {
    response.status(400).end();
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
  });

  const savedBlog = await newBlog.save();

  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;