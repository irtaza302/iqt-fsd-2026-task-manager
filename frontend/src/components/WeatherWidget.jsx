import { useEffect, useState } from "react";

export default function WeatherWidget({ fetchWeather }) {
  const [city, setCity] = useState("London");
  const [query, setQuery] = useState("London");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchWeather(query);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(err.message || "Failed to load weather");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [query, fetchWeather]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) setQuery(city.trim());
  };

  return (
    <section className="weather-card" aria-label="Weather integration">
      <h2>Public API · Open-Meteo Weather</h2>

      <form className="weather-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          aria-label="City name"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "…" : "Get weather"}
        </button>
      </form>

      {error && <p className="weather-meta" style={{ color: "#fca5a5" }}>{error}</p>}

      {data && !error && (
        <>
          <div className="weather-data">
            <div className="weather-temp">
              {Math.round(data.current.temperature)}
              {data.current.temperatureUnit}
            </div>
            <div className="weather-meta">
              <div>
                <strong>
                  {data.location.name}
                  {data.location.country ? `, ${data.location.country}` : ""}
                </strong>
              </div>
              <div>{data.current.weatherDescription}</div>
              <div>
                Humidity {data.current.humidity}
                {data.current.humidityUnit} · Wind {data.current.windSpeed}{" "}
                {data.current.windSpeedUnit}
              </div>
            </div>
          </div>
          <p className="weather-source">
            Data from{" "}
            <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
              Open-Meteo
            </a>{" "}
            (no API key required)
          </p>
        </>
      )}
    </section>
  );
}
