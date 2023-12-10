const CountryList = ({ countries, onCountryClick }) => {
  return (
    <ul style={{ padding: 0 }}>
      {countries.map((item, i) => (
        <li key={item.name.common + i} style={{ marginBottom: "1rem" }}>
          {item.name.common}{" "}
          <button
            style={{
              marginInlineStart: "1rem",
              fontSize: "0.75rem",
              backgroundColor: "white",
              color: "black",
            }}
            onClick={() => onCountryClick(item.name.common)}
          >
            show
          </button>
        </li>
      ))}
    </ul>
  );
};
export default CountryList;
