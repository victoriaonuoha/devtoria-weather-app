import Header from "./components/Header";
import SearchBar from "./components/SearchBar";

import { useState } from "react";
import Weatherlist from "./components/WeatherList";

function App() {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  const handleSelectCity = (city) => {
    setSelectedCity({
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      country: city.country,
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center inset-0 bg-black/10"
      style={{
        backgroundImage:
          "url('/images/—Pngtree—white cloud on blue sky_1229456.jpg')",
      }}
    >
      <div className="inset-0 bg-black/50 pt-4 min-h-screen ">
        <Header />
        <div className="px-4 md:px-[12rem]">
          {" "}
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSelectCity={handleSelectCity}
          />
          <Weatherlist city={selectedCity} query={query} />
        </div>
      </div>
    </div>
  );
}

export default App;
