const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give passw as arg");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://miikka0k:${password}@cluster0.cxvq5kf.mongodb.net/phoneBook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const schema = mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model("Person", schema);

function savePerson(person) {
  const name = person.name;
  const phone = person.phone;
  const newPerson = new Person({
    name,
    phone,
  });
  return newPerson.save();
}

function retrieveAllPersons() {
  return Person.find({});
}

if (process.argv.length > 3) {
  const name = process.argv[3];
  const phone = process.argv[4];
  savePerson({
    name,
    phone,
  }).then(() => {
    console.log(`added ${name}`);
    mongoose.connection.close();
  });
} else {
  retrieveAllPersons().then((result) => {
    console.log("Phonebook: ");

    result.forEach((person) => {
      console.log(person.name, person.phone);
    });
    mongoose.connection.close();
  });
}
