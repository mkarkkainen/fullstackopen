const mongoose = require("mongoose");

mongoose.set();

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => console.log("Connected to DB"))
  .catch((err) => console.log("Error with connection: ", err.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{7,}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    minLength: 8,
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
