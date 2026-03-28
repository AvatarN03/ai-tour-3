"use client";

import { useState, useEffect } from "react";

import { Button } from "../../ui/button";

import { useWeather } from "@/context/useWeather";

const LocationAccess = () => {
  const {
    weather,
    forecast,
    isLoading,
    isSearching,
    getCurrentLocation,
    searchWeatherByCity,
  } = useWeather();

  const [cityInput, setCityInput] = useState("");

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      searchWeatherByCity(cityInput.trim());
      setCityInput("");
    }
  };

  useEffect(() => {
    getCurrentLocation()
  }, [])

  return (
    <div className="p-3 rounded-md sm:p-6 dark:bg-gray-800 bg-accent">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Weather Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get weather for your current location or search by city name
        </p>
      </div>

      {/* Search + Location Controls */}
      <div className="space-y-4 mb-6">
        {/* City Search */}
        <form onSubmit={handleCitySearch} className="flex md:items-center flex-col md:flex-row gap-2">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isSearching}
          />
          <Button type="submit" disabled={isSearching || !cityInput.trim()}>
            {isSearching ? "Searching..." : "🔍 Search"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="text-xs text-gray-500 uppercase">OR</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Current Location */}
        <Button
          onClick={getCurrentLocation}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? "Getting Location..." : "📍 Use Current Location"}
        </Button>
      </div>
      <div className="flex flex-col md:flex-row items-stretch gap-2 md:h-56">


        {/* Weather Display */}
        {weather && (
          <div className="w-full h-full max-w-md xl:max-w-[600px] bg-gradient-to-tr from-blue-700 to-cyan-600 text-white rounded-xl shadow-lg p-3 md:p-6 flex flex-col gap-3 md:gap-4">
            <h4 className="text-xl font-semibold flex items-center justify-center gap-2 mb-4  rounded-md">
              📍 {weather.name}
            </h4>
            <div className="flex justify-center gap-4 items-center mb-2">
              <span className="text-5xl font-extrabold">
                {weather.current.icon}
              </span>
              <span className="text-5xl font-extrabold">
                {Math.round(weather.current.temperature)}°C
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-2 text-center">
              <div>
                <span className="block text-sm text-cyan-100 font-medium">
                  Wind Speed
                </span>
                <span className="block text-lg font-semibold">
                  {weather.current.windSpeed} km/h
                </span>
              </div>
              <div>
                <span className="block text-sm text-cyan-100 font-medium">
                  Humidity
                </span>
                <span className="block text-lg font-semibold">
                  {weather.current.humidity} %
                </span>
              </div>
              <div>
                <span className="block text-sm text-cyan-100 font-medium">
                  Condition
                </span>
                <span className="block text-lg font-semibold">
                  {weather.current.condition}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Forecast */}
        <div className="flex h-full flex-1">

          {forecast && forecast.length > 0 && (
            <div className="flex gap-3 mt-4 md:mt-0 mx-auto w-full h-full items-stretch">
              {forecast.map((day) => (
                <div
                  key={day.date}
                  className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center shadow w-full max-w-[400px] flex flex-col justify-between h-full from-blue-300 dark:from-blue-600 to-cyan-500 hover:bg-gradient-to-tr transition-colors group"
                >
                  <div className="flex flex-col gap-4">

                    <p className="text-sm text-gray-800 dark:text-gray-300">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>

                    <div className="text-4xl my-1 group-hover:text-5xl group-hover:mt-2 transition-discrete ease-in-out duration-150">{day.icon}</div>
                  </div>
                  <div className="flex flex-col gap-2">


                    <p className="text-md md:text-base font-semibold text-gray-800 dark:text-white">
                      {day.temperature}°C
                    </p>

                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {day.condition}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!weather && !isLoading && !isSearching && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🌤️</div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Search for a city or enable location access to see weather data
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationAccess;
