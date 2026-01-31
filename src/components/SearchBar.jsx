import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ query, setQuery, onSelectCity }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncer = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchSuggestions = async (q) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          q,
        )}&limit=5&appid=${apiKey}`,
      );
      if (!res.ok) throw new Error("Network error while fetching suggestions");
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setSuggestions([]);
        setError("No matches found");
      } else {
        setSuggestions(data);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }
    clearTimeout(debouncer.current);
    debouncer.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 0);

    return () => clearTimeout(debouncer.current);
  }, [query]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    setQuery(
      `${city.name}${city.state ? ", " + city.state : ""}, ${city.country}`,
    );
    setSuggestions([]);
    setError(null);

    if (onSelectCity) {
      onSelectCity(city);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length === 0) {
      setError("Please type a valid city name");
    } else {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[70rem] mt-4 mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city..."
            className="w-full lg:pl-10  pl-4 pr-4 py-2 rounded-md bg-white/30 backdrop-blur-md text-white placeholder-white/70 focus:outline-none hover:bg-white/40 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="font-bold bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-md border border-white/30 hover:bg-white/40 transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full bg-white/90 backdrop-blur-sm rounded-md shadow-lg text-gray-900">
          {suggestions.map((c, i) => (
            <li
              key={`${c.lat}-${c.lon}-${i}`}
              onMouseDown={() => handleSelect(c)}
              className="px-4 py-2 hover:bg-white/60 cursor-pointer"
            >
              {c.name}
              {c.state ? `, ${c.state}` : ""}, {c.country}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-300 mt-2">{error}</p>}
      {loading && !suggestions.length && (
        <p className="text-white mt-2">Searching...</p>
      )}
    </div>
  );
}
