const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

function getWeatherIcon(iconCode) {
  const map = {
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
  return map[iconCode] || "🌡️";
}
// By coordinates
async function getWeatherByCoords(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  );
  const data = await res.json();
  console.log(data);

  // Transform response into your component’s format
  return {
    name: data.name, // e.g. "Ambarnath"
    current: {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].icon),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    },
  };
}

// By city name
async function getWeatherByCity(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`,
  );
  const data = await res.json();
  console.log(data);

  // Transform response into your component’s format
  return {
    name: data.name, // e.g. "Ambarnath"
    current: {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].icon),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    },
  };
}

async function getForecastByCoords(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  );

  const data = await res.json();

  const forecast = data.list
    .filter((item) => item.dt_txt.includes("12:00:00")) // pick midday forecast
    .slice(0, 3) // next 3 days
    .map((item) => ({
      date: item.dt_txt.split(" ")[0],
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].description,
      icon: getWeatherIcon(item.weather[0].icon),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }));

  return {
    name: data.city.name,
    forecast,
  };
}


async function getForecastByCity(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );

  const data = await res.json();

  const forecast = data.list
    .filter(item => item.dt_txt.includes("12:00:00"))
    .slice(0, 3)
    .map(item => ({
      date: item.dt_txt.split(" ")[0],
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].description,
      icon: getWeatherIcon(item.weather[0].icon),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed
    }));

  return {
    name: data.city.name,
    forecast
  };
}

export { getWeatherByCoords, getWeatherByCity, getForecastByCoords, getForecastByCity };
