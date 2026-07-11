# Step 3 — Public API Integration

## API used
**Open-Meteo** — https://open-meteo.com  
Free, open-source weather API. **No API key required.**

## Implementation summary
| Layer | File | Role |
|-------|------|------|
| Backend proxy | `backend/routes/weather.js` | Geocode city → fetch current weather → return JSON |
| Frontend UI | `frontend/src/components/WeatherWidget.jsx` | City search + display temperature, conditions, wind |
| Client helper | `frontend/src/api.js` | `weatherApi.get(city)` |

Flow:
1. User enters a city in the weather card.
2. Frontend calls `GET /api/weather?city=...`
3. Backend calls Open-Meteo geocoding, then forecast APIs.
4. UI shows temperature, description, humidity, and wind.

## Screenshot
After running the app, screenshot the weather card and save as:

`docs/weather-integration.png`

## Commit reference

```
https://github.com/irtaza302/iqt-fsd-2026-task-manager/commit/5d52eea
```
