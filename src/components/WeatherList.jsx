import { CloudSun } from "lucide-react";
import { useEffect, useState } from "react";

export default function WeatherList({ city, query }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=weathercode,temperature_2m_mean&forecast_days=7&timezone=Africa/Lagos`,
        );

        if (!res.ok) throw new Error("Failed to fetch weather");

        const data = await res.json();
        console.log(data);
        setForecast(data.daily);
      } catch (err) {
        setError("Could not load weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (!city) return null;
  if (loading) return <p className="text-white mt-4">Loading forecast...</p>;
  if (error) return <p className="text-red-300 mt-4">{error}</p>;

  const getWeatherText = (code) => {
    if (code === 0) return "Clear sky";
    if (code <= 3) return "Partly cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 57) return " Freezing Drizzle";
    if (code <= 65) return " Slight Rain";
    if (code <= 67) return "Freezing Rain";
    if (code >= 77) return "Snow Grains";
    if (code >= 86) return "Heavy Snow Showers";
    if (code >= 99) return "Thunderstorm with hail";
    return "Unknown";
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        {" "}
        <div className="bg-white/30 lg:w-2/5 w-6/7 backdrop-blur-lg text-white text-xl lg:text-2xl font-semibold lg:font-bold p-3 mt-2 rounded-md ">
          <h1 className="text-white"> Location: {city?.name}</h1>
          <p>
            {forecast?.temperature_2m_mean[0]
              ? `Today: ${forecast.time[0]}`
              : "No data available"}
          </p>
          <p>
            {" "}
            {forecast?.temperature_2m_mean[0]
              ? ` Temperature: ${forecast.temperature_2m_mean[0]}°C`
              : "No data available"}
          </p>
          <p>{getWeatherText(forecast?.weathercode[0])}!</p>
        </div>
      </div>

      <div className="mt-6 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {forecast?.time.slice(1).map((day, index) => (
          <div
            key={day}
            onClick={() =>
              setSelectedItem({
                date: day,
                temp: forecast.temperature_2m_mean[index + 1],
                weather: forecast.weathercode[index + 1],
              })
            }
            className="bg-white/30 backdrop-blur-md text-white p-4 rounded-md"
          >
            <CloudSun size={28} color="orange" />
            <p className="font-semibold text-xl">Date: {day}</p>
            {/* <p>{getWeatherText(forecast.weathercode[index + 1])}</p> */}
            <p className="font-semibold text-xl">
              {forecast.temperature_2m_mean[index + 1]}°C
            </p>
          </div>
        ))}
      </div>
      {selectItem && (
        <div className="fixed inset-0 px-4 bg-black/60 flex items-center justify-center text-white">
          <div className="bg-white/40 backdrop-blur-md px-6 py-4 rounded-lg w-96 lg:w-1/3">
            <div className=" flex justify-end w-full">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold cursor-pointer"
              >
                {" "}
                X
              </button>
            </div>
            <h2 className="text-xl font-bold">Date: {selectItem.date}</h2>
            <h2 className="text-xl font-bold"> Temp: {selectItem.temp}°C</h2>
            <p className="text-xl font-semibold">
              {getWeatherText(selectItem.weather)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
