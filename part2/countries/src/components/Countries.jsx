import CountryList from "./CountryList";
import Country from "./Country";

const Countries = ({ countries, newFilter, onCountryClick }) => {
  const filteredList = countries.filter((country) =>
    country.name.common.toLowerCase().includes(newFilter.toLowerCase())
  );

  if (filteredList.length > 1 && filteredList.length < 10) {
    return (
      <CountryList countries={filteredList} onCountryClick={onCountryClick} />
    );
  } else if (filteredList.length === 1) {
    return <Country country={filteredList[0]} />;
  } else
    return newFilter.length === 0 ? (
      ""
    ) : (
      <li>Too many matches, specify another filter</li>
    );
};

export default Countries;
