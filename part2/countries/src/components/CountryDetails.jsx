const CountryDetails = ({ country }) => {
  const { name, capital, area, flags, languages } = country;

  return (
    <>
      <h1>{name.common}</h1>
      <p>capital: {capital[0]}</p>
      <p>area: {area}</p>
      <div>
        Languages:
        <ul>
          {Object.keys(languages).map((key) => (
            <li key={key}>{languages[key]}</li>
          ))}
        </ul>
      </div>
      <img src={flags.svg} width={200} height={200} />
    </>
  );
};

export default CountryDetails;
