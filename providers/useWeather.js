"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { getForecastByCity, getForecastByCoords, getWeatherByCity, getWeatherByCoords } from "@/lib/api/weather";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [forecast, setForecast] = useState([]);

  // 🌍 Load weather from sessionStorage on mount
  useEffect(() => {
    const savedWeather = sessionStorage.getItem("weather");
    const savedForecast = sessionStorage.getItem("forecast");
    if (savedWeather) {
      try {
        setWeather(JSON.parse(savedWeather));
      } catch (err) {
        console.error("Failed to parse saved weather data:", err);
      }
    }
    if (savedForecast) {
      try {
        setForecast(JSON.parse(savedForecast));
      } catch (err) {
        console.error("Failed to parse saved forecast data:", err);
      }
    }

    if (!savedWeather) {
      getCurrentLocation();
    }
  }, []);

  useEffect(() => {
    if (forecast.length > 0) {
      sessionStorage.setItem("forecast", JSON.stringify(forecast));
    }
  }, [forecast]);

  // 🌍 Save weather to sessionStorage whenever it changes
  useEffect(() => {
    if (weather) {
      sessionStorage.setItem("weather", JSON.stringify(weather));
    }
  }, [weather]);

  // 🌍 Get weather by current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.", {
        className: "bg-red-600 text-white border-red-800",
      });
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(1);
        const lon = position.coords.longitude.toFixed(1);
        console.log(lat, lon);

        setPermissionGranted(true);

        try {
          const weatherRes = await getWeatherByCoords(lat, lon);
          const forecastRes = await getForecastByCoords(lat, lon);

          setWeather(weatherRes);
          setForecast(forecastRes.forecast);

          sessionStorage.setItem("weather", JSON.stringify(weatherRes));
          sessionStorage.setItem(
            "forecast",
            JSON.stringify(forecastRes.forecast),
          );

          toast.success("Location updated successfully!");
        } catch (err) {
          toast.error("Failed to fetch weather data");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        toast.error(getLocationErrorMessage(error.code));
        setIsLoading(false);
        setPermissionGranted(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  // 🏙️ Search weather by city
  const searchWeatherByCity = async (city) => {
    if (!city) {
      toast.error("Please enter a city name");
      return;
    }

    setIsSearching(true);
    try {
      const weatherRes = await getWeatherByCity(city);
      const forecastRes = await getForecastByCity(city);

      setWeather(weatherRes);
      setForecast(forecastRes.forecast);

      sessionStorage.setItem("weather", JSON.stringify(weatherRes));
      sessionStorage.setItem("forecast", JSON.stringify(forecastRes.forecast));

      toast.success(`Weather data loaded for ${city}`);
    } catch (err) {
      toast.error("City not found. Please try another city.");
    } finally {
      setIsSearching(false);
    }
  };

  const getLocationErrorMessage = (code) => {
    switch (code) {
      case 1:
        return "Location access denied. Please enable location permissions.";
      case 2:
        return "Location unavailable. Please check your connection.";
      case 3:
        return "Location request timed out. Please try again.";
      default:
        return "Unable to get your location. Please try again.";
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        weather,
        forecast,
        isLoading,
        isSearching,
        permissionGranted,
        getCurrentLocation,
        searchWeatherByCity,
        setWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
