"use server";



const API_KEY = process.env.WEATHER_API_KEY;


const WEATHER_ICON_MAP = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "🌤️",
  "02n": "☁️",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "🌩️",
  "11n": "🌩️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

function getWeatherIcon(iconCode) {
  return WEATHER_ICON_MAP[iconCode] ?? "🌡️";
}

// ---------------------------------------------------------------------------
// Shared response transformers (eliminates duplication across by-coord / by-city)
// ---------------------------------------------------------------------------

function transformCurrentWeather(data) {
  return {
    name: data.name,
    current: {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].icon),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    },
  };
}

function transformForecast(data) {
  const forecast = data.list
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 3)
    .map((item) => ({
      date: item.dt_txt.split(" ")[0],
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].description,
      icon: getWeatherIcon(item.weather[0].icon),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }));

  return { name: data.city.name, forecast };
}

// ---------------------------------------------------------------------------
// Shared fetch helpers
// ---------------------------------------------------------------------------

async function fetchWeather(endpoint, params) {
  const query = new URLSearchParams({ ...params, units: "metric", appid: API_KEY });
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/${endpoint}?${query}`
  );
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Exported server actions
// ---------------------------------------------------------------------------

export async function getWeatherByCoords(lat, lon) {
  const data = await fetchWeather("weather", { lat, lon });
  return transformCurrentWeather(data);
}

export async function getWeatherByCity(city) {
  const data = await fetchWeather("weather", { q: city });
  return transformCurrentWeather(data);
}

export async function getForecastByCoords(lat, lon) {
  const data = await fetchWeather("forecast", { lat, lon });
  return transformForecast(data);
}

export async function getForecastByCity(city) {
  const data = await fetchWeather("forecast", { q: city });
  return transformForecast(data);
}