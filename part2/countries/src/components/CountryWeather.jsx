import { useState, useEffect } from "react";
import axios from "axios";

const CountryWeather = ({ country }) => {
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    const params = {
      q: country.capital[0],
      appid: import.meta.env.VITE_API_KEY,
      units: "metric",
    };

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather`, { params })
      .then((res) => {
        setWeather(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (weather.length === 0) return null;

  return (
    <>
      <h2>Weather in {country.capital[0]}</h2>
      <p>temperature {weather.main.temp} °C</p>

      <img
        title=""
        alt=""
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
        width={100}
        height={100}
      />

      <p>wind {weather.wind.speed} m/s</p>
    </>
  );
};

export default CountryWeather;
