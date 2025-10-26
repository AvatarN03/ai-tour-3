"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { getWeatherByCity, getWeatherByCoords } from "@/lib/weather";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // 🌍 Load weather from localStorage on mount
  useEffect(() => {
    const savedWeather = localStorage.getItem("weather");
    if (savedWeather) {
      try {
        setWeather(JSON.parse(savedWeather));
      } catch (err) {
        console.error("Failed to parse saved weather data:", err);
      }
    } else {
      getCurrentLocation();
    }
    // Also fetch current location weather as fallback or initial load
  }, []);

  // 🌍 Save weather to localStorage whenever it changes
  useEffect(() => {
    if (weather) {
      localStorage.setItem("weather", JSON.stringify(weather));
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
          const res = await getWeatherByCoords(lat, lon);
          setWeather(res);
          localStorage.setItem("weather", JSON.stringify(res)); // Update localStorage
          toast.success("Location updated successfully!");
        } catch (err) {
          toast.error("Failed to fetch weather data");
        }
        setIsLoading(false);
      },
      (error) => {
        toast.error(getLocationErrorMessage(error.code));
        setIsLoading(false);
        setPermissionGranted(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // 🏙️ Search weather by city
  const searchWeatherByCity = async (city) => {
    if (!city.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    setIsSearching(true);
    try {
      const res = await getWeatherByCity(city);
      setWeather(res);
      localStorage.setItem("ai-weather", JSON.stringify(res)); // Update localStorage
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
