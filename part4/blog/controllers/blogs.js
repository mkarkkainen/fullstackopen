const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  console.log("get by id", blog);
  response.json(blog);
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes, userId } = request.body;

  const user = await User.findById(userId);

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes ? likes : 0,
    user: user.id,
  });

  if (!title || !url) {
    response.status(400).json({ error: "missing url and/or title" }).end();
  } else {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(blog._id);
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const id = request.params.id;

  const result = await Blog.findByIdAndUpdate(id, {
    title,
    author,
    url,
    likes,
  });

  const updatedBlog = await Blog.findByIdAndUpdate(id, result, { new: true });

  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
