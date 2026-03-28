"use server";

import axios from "axios";

import { WEATHER_ICON_MAP } from "@/lib/constants";




const API_KEY = process.env.WEATHER_API_KEY;

function getWeatherIcon(iconCode) {
  return WEATHER_ICON_MAP[iconCode] ?? "🌡️";
}


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


async function fetchWeather(endpoint, params) {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/${endpoint}`,
      {
        params: {
          ...params,
          units: "metric",
          appid: API_KEY,
        },
      }
    );

    return res.data;

  } catch (error) {
    

    if (error.response) {
      throw new Error(`Weather API error: ${error.response.status}`);
    } else {

      throw new Error(`Network error: ${error.message}`);
    }
  }
}


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