import CountryDetails from "./CountryDetails";
import CountryWeather from "./CountryWeather";

const Country = ({ country }) => {
  return (
    <>
      <CountryDetails country={country} />
      <CountryWeather country={country} />
    </>
  );
};

export default Country;
