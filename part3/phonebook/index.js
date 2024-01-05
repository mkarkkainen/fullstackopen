require("dotenv").config();

const Person = require("./models/person");
const morgan = require("morgan");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body"),
);

app.get("/info", (req, res, next) => {
  const date = new Date();
  Person.find({})
    .then((result) => {
      res.send(
        `<p>Phonebook has info for ${result.length} people</p><p>${date}</p>`,
      );
    })
    .catch((err) => next(err));
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.send(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.post("/api/persons/", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person
      .save()
      .then(() => {
        res.status(201).send("added");
      })
      .catch((err) => next(err));
  }
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
