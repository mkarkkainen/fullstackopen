/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import personsServices from "./services/persons";

const Button = ({ text, type }) => <button type={type}>{text}</button>;

const Input = ({ text, value, onChange }) => {
  return (
    <div>
      {text}: <input value={value} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({
  handleSubmit,
  newName,
  newNumber,
  handleNewName,
  handleNewNumber,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Input text="name" value={newName} onChange={handleNewName} />
      <Input text="number" value={newNumber} onChange={handleNewNumber} />
      <Button text="add" type="submit" />
    </form>
  );
};

const Title = ({ title }) => <h2>{title}</h2>;

const Persons = ({ persons, newFilter }) => {
  const filteredList = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLocaleLowerCase())
  );

  return (
    <div>
      <ul style={{ padding: 0 }}>
        {filteredList.map((item, i) => (
          <Person
            key={item.name + i}
            name={item.name}
            number={item.number}
            id={item.id}
          />
        ))}
      </ul>
    </div>
  );
};

const Person = ({ name, number }) => {
  if (name && number) {
    return (
      <li>
        {name} {number} <Button text="delete" />
      </li>
    );
  }
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    try {
      personsServices.getAll().then((result) => setPersons(result));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleNewName = (e) => setNewName(e.target.value);
  const handleNewNumber = (e) => setNewNumber(e.target.value);
  const handleNewFilter = (e) => setNewFilter(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName) {
      return alert("Name field empty!");
    }
    if (!newNumber) {
      return alert("Number field empty!");
    }
    if (JSON.stringify(persons).includes(newName)) {
      setNewName("");
      return alert(`${newName} is already added to the phonebook`);
    }

    const newObject = {
      name: newName,
      number: newNumber,
      id: Math.floor(Math.random(100)),
    };
    setPersons([...persons, newObject]);

    personsServices.create(newObject);

    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <Title title="Search" />
      <Input text="filter" value={newFilter} onChange={handleNewFilter} />
      <Title title="Add new" />
      <PersonForm
        handleSubmit={handleSubmit}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
        newName={newName}
        newNumber={newNumber}
      />
      <Title title="Numbers" />
      <Persons
        persons={persons}
        newFilter={newFilter}
        handleFunction={() => {}}
      />
    </div>
  );
};

export default App;
