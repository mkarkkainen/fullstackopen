/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import Input from "./components/Input";
import Countries from "./components/Countries";

function App() {
  const [newFilter, setNewFilter] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => setCountries(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleNewFilter = (e) => setNewFilter(e.target.value);

  return (
    <>
      <Input
        text="find countries"
        value={newFilter}
        onChange={handleNewFilter}
      />

      <Countries
        countries={countries && countries}
        newFilter={newFilter}
        onCountryClick={(name) => setNewFilter(name)}
      />
    </>
  );
}

export default App;
