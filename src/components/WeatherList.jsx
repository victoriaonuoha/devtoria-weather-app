import { useEffect, useState } from "react";

export default function WeatherList({ city }) {
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
      <div>
        <h1>Today</h1>
        <p>
          {forecast?.temperature_2m_mean[0]
            ? `Date: ${forecast.time[0]}`
            : "No data available"}
        </p>
        <p>
          {" "}
          {forecast?.temperature_2m_mean[0]
            ? ` Temperature: ${forecast.temperature_2m_mean[0]}°C`
            : "No data available"}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
            <p className="font-semibold">Date: {day}</p>
            <p>{getWeatherText(forecast.weathercode[index + 1])}</p>
            <p>{forecast.temperature_2m_mean[index + 1]}°C</p>
          </div>
        ))}
      </div>
      {selectItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold">{selectItem.temp}°C</h2>
            <p className="mt-2">uuuu</p>

            <button
              onClick={() => setSelectedItem(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
