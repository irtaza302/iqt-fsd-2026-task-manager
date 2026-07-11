const express = require("express");

const router = express.Router();

/**
 * GET /api/weather?city=London
 *
 * Public API Integration: Open-Meteo (https://open-meteo.com)
 * - No API key required
 * - Geocoding API resolves city name → lat/lon
 * - Forecast API returns current weather
 */
router.get("/", async (req, res) => {
  try {
    const city = (req.query.city || "London").toString().trim();

    if (!city) {
      return res.status(400).json({ error: "City query parameter is required" });
    }

    // Step 1: Geocode city name
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      throw new Error(`Geocoding failed with status ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ error: `City not found: ${city}` });
    }

    const place = geoData.results[0];
    const { latitude, longitude, name, country, admin1 } = place;

    // Step 2: Fetch current weather
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
      `&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Weather fetch failed with status ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    res.json({
      location: {
        name,
        region: admin1 || null,
        country,
        latitude,
        longitude,
      },
      current: {
        temperature: current.temperature_2m,
        temperatureUnit: weatherData.current_units.temperature_2m,
        humidity: current.relative_humidity_2m,
        humidityUnit: weatherData.current_units.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        windSpeedUnit: weatherData.current_units.wind_speed_10m,
        weatherCode: current.weather_code,
        weatherDescription: weatherCodeToText(current.weather_code),
        time: current.time,
      },
      source: "Open-Meteo (https://open-meteo.com)",
    });
  } catch (error) {
    console.error("GET /api/weather error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

/** WMO weather interpretation codes (Open-Meteo) */
function weatherCodeToText(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return map[code] || `Weather code ${code}`;
}

module.exports = router;
