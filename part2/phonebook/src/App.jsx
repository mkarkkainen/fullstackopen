/* eslint-disable react/prop-types */
import { useState } from "react";

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
        {name} {number}
      </li>
    );
  }
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

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

    setPersons([...persons, { name: newName, number: newNumber }]);
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
      <Persons persons={persons} newFilter={newFilter} />
    </div>
  );
};

export default App;
