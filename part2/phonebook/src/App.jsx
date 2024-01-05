/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import personServices from "./services/persons";

const Button = ({ text, type, handleNewChange }) => (
  <button onClick={handleNewChange} type={type}>
    {text}
  </button>
);

const Input = ({ text, value, onChange }) => {
  return (
    <div>
      {text}: <input value={value} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({ addNewPerson, newPerson, handleChange }) => {
  return (
    <form onSubmit={addNewPerson}>
      <div>
        name:{" "}
        <input name="name" value={newPerson.name} onChange={handleChange} />
      </div>
      <div>
        number:
        <input name="number" value={newPerson.number} onChange={handleChange} />
      </div>
      <div>
        <Button text="add" type="submit" />
      </div>
    </form>
  );
};

const Title = ({ title }) => <h2>{title}</h2>;

const App = () => {
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [persons, setPersons] = useState([]);
  const [newFilter, setNewFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personServices.getAll().then((initialPeople) => setPersons(initialPeople));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMessage("");
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [message]);
  console.log(persons);
  const Persons = ({ persons, newFilter }) => {
    const filteredList = persons.filter((person) =>
      person.name.toLowerCase().includes(newFilter.toLowerCase()),
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

  const Person = ({ name, number, id }) => {
    if (name && number) {
      return (
        <li>
          {name} {number}{" "}
          <Button
            text="delete"
            type="submit"
            handleNewChange={() => {
              handleDelete(id, name);
            }}
          />
        </li>
      );
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewPerson({ ...newPerson, [name]: value });
  };

  const handleNewFilter = (e) => setNewFilter(e.target.value);

  const handleDelete = (id, name) => {
    if (window.confirm(`Do you want to delete ${name}`)) {
      personServices.remove(id).then(() => {
        setPersons(persons.filter((personInState) => personInState.id !== id));
        setMessage(`Deleted ${name}`);
      });
    }
  };

  function doesNameExist(inputName, entries) {
    return entries.some((entry) => entry.name === inputName);
  }

  function getIdByName(inputName, entries) {
    const foundEntry = entries.find((entry) => entry.name === inputName);
    return foundEntry ? foundEntry.id : undefined;
  }

  const addNewPerson = (e) => {
    e.preventDefault();
    if (!newPerson.name) {
      return alert("Name field empty!");
    }
    if (!newPerson.number) {
      return alert("Number field empty!");
    }

    const exists = doesNameExist(newPerson.name, persons);
    const id = getIdByName(newPerson.name, persons);

    if (exists) {
      if (
        window.confirm(
          `${newPerson.name} already exists in phonebook, do you want to change their number to ${newPerson.number}?`,
        )
      ) {
        personServices
          .update(id, newPerson)
          .then((returnedPerson) => {
            const updatedPersons = persons.map((person) =>
              person.id === returnedPerson.id ? returnedPerson : person,
            );
            setPersons(updatedPersons);
            setMessage(
              `Updated ${newPerson.name}'s number to ${newPerson.number}`,
            );
            setNewPerson({ name: "", number: "" });
          })
          .catch((err) => console.error(err));
      }
    } else {
      personServices.create(newPerson).then((returnedPerson) => {
        setMessage(`Added ${newPerson.name}`);
        setPersons([...persons, returnedPerson]);
        setNewPerson({ name: "", number: "" });
      });
    }
  };

  return (
    <div>
      <Title title="Phonebook" />
      {message && (
        <div
          style={{
            color: "green",
            backgroundColor: "#d6d4ce",
            borderRadius: "4px",
            padding: "1rem",
            border: "solid 3px green",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          {message}
        </div>
      )}
      <Input text="filter" value={newFilter} onChange={handleNewFilter} />
      <Title title="Add new" />
      <PersonForm
        handleChange={handleChange}
        addNewPerson={addNewPerson}
        newPerson={newPerson}
      />
      <Title title="Numbers" />
      <Persons persons={persons} newFilter={newFilter} />
    </div>
  );
};

export default App;
