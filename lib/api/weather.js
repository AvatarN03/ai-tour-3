
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY

function getWeatherIcon(iconCode) {
    const map = {
      "01d": "☀️", "01n": "🌙",
      "02d": "🌤️", "02n": "☁️",
      "03d": "☁️", "03n": "☁️",
      "04d": "☁️", "04n": "☁️",
      "09d": "🌧️", "09n": "🌧️",
      "10d": "🌦️", "10n": "🌧️",
      "11d": "🌩️", "11n": "🌩️",
      "13d": "❄️", "13n": "❄️",
      "50d": "🌫️", "50n": "🌫️",
    }
    return map[iconCode] || "🌡️"
  }
// By coordinates
async function getWeatherByCoords(lat, lon) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}
`);
    const data = await res.json()
    console.log(data)

    // Transform response into your component’s format
    return {
        name: data.name, // e.g. "Ambarnath"
        current: {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].description,
            icon: getWeatherIcon(data.weather[0].icon), 
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
        }
    }
}

// By city name
async function getWeatherByCity(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&units=metric`
    );
    const data = await res.json()
    console.log(data)

    // Transform response into your component’s format
    return {
        name: data.name, // e.g. "Ambarnath"
        current: {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].description,
            icon: getWeatherIcon(data.weather[0].icon),
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
        }
    }
}

export { getWeatherByCoords, getWeatherByCity }
