const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const userNameExists = await User.findOne({ username });

  if (userNameExists) {
    response.status(400).json({ error: "expected `username` to be unique" });
  }

  if (!username || !password) {
    response.status(400).json({ error: "username and/or password missing" });
  } else if (username.length < 3 || password.length < 3) {
    response
      .status(400)
      .json({ error: "username and password must be >= 3 characters" });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  }
});

module.exports = usersRouter;
