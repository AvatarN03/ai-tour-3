"use client";
import React, { useState } from "react";
import { Brain, MapPin, Calendar, Cloud, Utensils, Send } from "lucide-react";

// API Keys (replace with your own)
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY";
const OPENTRIP_API_KEY = "YOUR_OPENTRIP_API_KEY";

export default function AITravelAssistant() {
  const [aiMode, setAiMode] = useState("location");
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const aiModes = [
    { 
      id: "location", 
      icon: MapPin, 
      label: "Location Guide", 
      description: "Discover attractions and landmarks" 
    },
    { 
      id: "trip", 
      icon: Calendar, 
      label: "Trip Planner", 
      description: "Plan your itinerary" 
    },
    { 
      id: "weather", 
      icon: Cloud, 
      label: "Weather", 
      description: "Get weather forecasts" 
    },
    { 
      id: "dining", 
      icon: Utensils, 
      label: "Dining & Stay", 
      description: "Find restaurants and hotels" 
    },
  ];

  const handleAiQuery = async () => {
    if (!aiInput.trim()) return;

    setIsLoading(true);

    try {
      let response = "";

      switch (aiMode) {
        case "location":
          const locationRes = await fetch(
            `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
              aiInput
            )}&apikey=${OPENTRIP_API_KEY}`
          );
          const locationData = await locationRes.json();

          if (locationData.status === "OK" && locationData.name) {
            const { lat, lon, name, country } = locationData;

            const nearbyRes = await fetch(
              `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${lon}&lat=${lat}&kinds=interesting_places&apikey=${OPENTRIP_API_KEY}`
            );
            const nearbyData = await nearbyRes.json();

            const nearbyAttractions = nearbyData.features
              .slice(0, 5)
              .map((place) => place.properties.name)
              .filter(Boolean);

            response = `## 📍 ${name}\n\n**🏙️ Location:** ${name}, ${country}\n\n**🌍 Coordinates:** ${lat.toFixed(
              4
            )}° N, ${lon.toFixed(
              4
            )}° E\n\n**🏛️ Nearby Attractions (within 5 km):**\n${
              nearbyAttractions.length > 0
                ? nearbyAttractions.map((attr) => `* ${attr}`).join("\n")
                : "* No attractions found in this area"
            }`;
          } else {
            response = `❌ Location not found. Please try a different search term.`;
          }
          break;

        case "weather":
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
              aiInput
            )}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );
          const weatherData = await weatherRes.json();

          if (weatherData.cod === "200") {
            const dailyForecasts = weatherData.list
              .filter((item, index) => index % 8 === 0)
              .slice(0, 7);

            const weatherTable = dailyForecasts.map((forecast, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              return `| ${date.toLocaleDateString("en-US", {
                weekday: "short",
              })} | ${date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })} | ${getWeatherEmoji(forecast.weather[0].main)} ${
                forecast.weather[0].description
              } | ${Math.round(forecast.main.temp_min)}-${Math.round(
                forecast.main.temp_max
              )}°C | ${forecast.main.humidity}% | ${Math.round(
                forecast.wind.speed * 3.6
              )} km/h |`;
            });

            response = `## 🌤️ 7-Day Weather Forecast for ${aiInput}\n\n| Day | Date | Condition | Temp | Humidity | Wind |\n|-----|------|-----------|------|----------|------|\n${weatherTable.join(
              "\n"
            )}`;
          } else {
            response = `❌ Weather data not found for ${aiInput}. Please try a different location.`;
          }
          break;

        case "dining":
          const cityRes = await fetch(
            `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
              aiInput
            )}&apikey=${OPENTRIP_API_KEY}`
          );
          const cityData = await cityRes.json();

          if (cityData.status === "OK" && cityData.name) {
            const { lat, lon } = cityData;

            const restaurantsRes = await fetch(
              `https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=${lon}&lat=${lat}&kinds=restaurants&apikey=${OPENTRIP_API_KEY}`
            );
            const restaurantsData = await restaurantsRes.json();

            const hotelsRes = await fetch(
              `https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=${lon}&lat=${lat}&kinds=hotels&apikey=${OPENTRIP_API_KEY}`
            );
            const hotelsData = await hotelsRes.json();

            const restaurants = restaurantsData.features
              .slice(0, 5)
              .map((place) => place.properties.name)
              .filter(Boolean);

            const hotels = hotelsData.features
              .slice(0, 5)
              .map((place) => place.properties.name)
              .filter(Boolean);

            response = `## 🍴 Dining & Accommodation in ${cityData.name}\n\n### Restaurants Nearby:\n${
              restaurants.length > 0
                ? restaurants.map((rest, i) => `* ${rest}`).join("\n")
                : "* No restaurants found in this area"
            }\n\n### Hotels & Accommodation:\n${
              hotels.length > 0
                ? hotels.map((hotel, i) => `* ${hotel}`).join("\n")
                : "* No hotels found in this area"
            }`;
          } else {
            response = `❌ Location not found. Please try a different search term.`;
          }
          break;

        case "trip":
          const [destination, duration] = aiInput.split(/\s+(?=\d)/);
          const days = parseInt(duration) || 5;

          const destRes = await fetch(
            `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
              destination
            )}&apikey=${OPENTRIP_API_KEY}`
          );
          const destData = await destRes.json();

          if (destData.status === "OK" && destData.name) {
            const { lat, lon, name, country } = destData;

            const attractionsRes = await fetch(
              `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${lon}&lat=${lat}&kinds=interesting_places&apikey=${OPENTRIP_API_KEY}`
            );
            const attractionsData = await attractionsRes.json();

            const attractions = attractionsData.features
              .slice(0, days * 2)
              .map((place) => place.properties.name)
              .filter(Boolean);

            const itinerary = Array.from({ length: days }, (_, i) => {
              const dayAttractions = attractions.slice(i * 2, (i + 1) * 2);
              return dayAttractions.length > 0
                ? `* **Day ${i + 1}:** ${dayAttractions.join(" & ")}`
                : `* **Day ${i + 1}:** Explore local area`;
            });

            response = `## ✈️ ${days}-Day Trip to ${name}, ${country}\n\n**📅 Duration:** ${days} Days\n\n**🗺️ Suggested Itinerary:**\n${itinerary.join(
              "\n"
            )}\n\n**💡 Tip:** Adjust the itinerary based on your interests and travel pace!`;
          } else {
            response = `❌ Destination not found. Please try a different search term.`;
          }
          break;
      }

      setAiResponse(response);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAiResponse(
        "⚠️ Sorry, there was an error processing your request. Please check your API keys and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherEmoji = (condition) => {
    const emojiMap = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Snow: "❄️",
      Thunderstorm: "⛈️",
      Drizzle: "🌦️",
      Mist: "🌫️",
    };
    return emojiMap[condition] || "⛅";
  };

  const getPlaceholder = () => {
    switch (aiMode) {
      case "location":
        return "e.g., Eiffel Tower, Tokyo Tower, Grand Canyon";
      case "trip":
        return "e.g., Paris 7, Tokyo 5, London 3";
      case "weather":
        return "e.g., London, New York, Tokyo";
      case "dining":
        return "e.g., Rome, Barcelona, Bangkok";
      default:
        return "Enter your query...";
    }
  };

  const getInputLabel = () => {
    switch (aiMode) {
      case "location":
        return "Enter a location name to discover attractions";
      case "trip":
        return "Enter destination and number of days (e.g., Paris 7)";
      case "weather":
        return "Enter a city name for weather forecast";
      case "dining":
        return "Enter a city name for dining and accommodation";
      default:
        return "Enter your query";
    }
  };

  const formatResponse = (text) => {
    return text
      .replace(/##\s+(.+)/g, '<h2 class="text-2xl font-bold text-purple-400 mt-6 mb-4">$1</h2>')
      .replace(/###\s+(.+)/g, '<h3 class="text-xl font-semibold text-blue-400 mt-4 mb-3">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\n\n/g, '<p class="mb-4"></p>')
      .replace(/^\* (.+)/gm, '<li class="ml-6 mb-2">$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul class="list-disc mb-4">$&</ul>')
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split("|").filter((c) => c.trim());
        const isHeaderRow = match.includes("Day") || match.includes("---");
        if (isHeaderRow && match.includes("---")) return "";
        return `<tr>${cells
          .map((cell) =>
            isHeaderRow
              ? `<th class="border border-slate-700 px-4 py-2 bg-slate-800 font-semibold">${cell.trim()}</th>`
              : `<td class="border border-slate-700 px-4 py-2">${cell.trim()}</td>`
          )
          .join("")}</tr>`;
      })
      .replace(/(<tr>.+<\/tr>\n?)+/gs, '<table class="w-full border-collapse my-4 text-sm overflow-x-auto">$&</table>');
  };

  return (
    <div className="dark:bg-slate-800 bg-white/80 shadow-xl rounded-md p-3 md:p-6 dark:text-white text-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="text-purple-400" size={32} />
        <div>
          <h2 className="text-2xl font-bold">AI Travel Assistant</h2>
          <p className="text-slate-400">
            Get instant travel information and recommendations
          </p>
        </div>
      </div>

      {/* AI Mode Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {aiModes.map(({ id, icon: Icon, label, description }) => (
          <button
            key={id}
            onClick={() => {
              setAiMode(id);
              setAiResponse("");
              setAiInput("");
            }}
            className={`flex flex-col cursor-pointer items-center gap-2 p-2 md:p-4 rounded-lg font-medium transition-all ${
              aiMode === id
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                : "bg-slate-900 text-slate-300 hover:bg-slate-850"
            }`}
          >
            <Icon size={24} />
            <span className="text-sm font-semibold text-center">{label}</span>
            <span className="hidden md:block text-xs opacity-75 text-center">{description}</span>
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="dark:bg-slate-900 bg-white  shadow-xl rounded-lg p-4 mb-6">
        <label className="block text-sm text-slate-400 mb-2">
          {getInputLabel()}
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleAiQuery()}
            placeholder={getPlaceholder()}
            className="flex-1 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            onClick={handleAiQuery}
            disabled={isLoading || !aiInput.trim()}
            className="bg-purple-600 cursor-pointer hover:bg-purple-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 hover:text-white disabled:cursor-not-allowed rounded-lg px-6 py-3 font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Processing...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span className="inline">Ask AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Response */}
      {aiResponse && (
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
          <div
            className="prose prose-invert max-w-none text-slate-200"
            dangerouslySetInnerHTML={{ __html: formatResponse(aiResponse) }}
          />
        </div>
      )}

      {!aiResponse && !isLoading && (
        <div className="bg-slate-900 rounded-lg p-12 text-center border border-slate-700">
          <Brain className="mx-auto mb-4 text-slate-600" size={48} />
          <p className="text-slate-400 mb-2">
            Select a mode and enter your query to get started
          </p>
          <p className="text-slate-500 text-sm">
            AI-powered insights for your perfect trip
          </p>
        </div>
      )}
    </div>
  );
}