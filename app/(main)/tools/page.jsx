"use client";
import React, { useState } from "react";
import {
  DollarSign,
  Repeat,
  Phone,
  Trash2,
  Edit2,
  Plus,
  Brain,
  MapPin,
  Calendar,
  Cloud,
  Utensils,
  Send,
} from "lucide-react";
import CurrencyConverter from "@/app/(main)/tools/CurrencyConvertor";
import { TABS } from "@/lib/constant";
import Emergency from "@/app/(main)/tools/Emergency";
import ExpenseTracker from "./ExpenseTracker";
import AITravelAssistant from "./AiTravel";

// API Keys (replace with your own)
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY";
const OPENTRIP_API_KEY = "YOUR_OPENTRIP_API_KEY";

export default function TravelTools() {
  const [activeTab, setActiveTab] = useState("expense");
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    currency: "INR",
  });

  const addExpense = () => {
    if (newExpense.category && newExpense.amount) {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          ...newExpense,
          amount: parseFloat(newExpense.amount),
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewExpense({ category: "", amount: "", currency: "USD" });
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);


  // AI Assistant State
  const [aiMode, setAiMode] = useState("location");
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAiQuery = async () => {
    if (!aiInput.trim()) return;

    setIsLoading(true);
    setCurrencyError("");

    try {
      let response = "";

      switch (aiMode) {
        case "location":
          // Fetch location data from OpenTripMap
          const locationRes = await fetch(
            `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
              aiInput
            )}&apikey=${OPENTRIP_API_KEY}`
          );
          const locationData = await locationRes.json();

          if (locationData.status === "OK" && locationData.name) {
            const { lat, lon, name, country } = locationData;

            // Get nearby attractions
            const nearbyRes = await fetch(
              `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${lon}&lat=${lat}&kinds=interesting_places&apikey=${OPENTRIP_API_KEY}`
            );
            const nearbyData = await nearbyRes.json();

            const nearbyAttractions = nearbyData.features
              .slice(0, 3)
              .map((place) => place.properties.name)
              .filter(Boolean);

            response = `## 📍 ${name}\n\n**🏙️ Location:** ${name}, ${country}\n\n**🌍 Coordinates:** ${lat.toFixed(
              4
            )}° N, ${lon.toFixed(
              4
            )}° E\n\n**🏛️ Nearby Attractions (within 5 km):**\n${nearbyAttractions
              .map((attr) => `* **${attr}**`)
              .join("\n")}`;
          } else {
            response = `Location not found. Please try a different search term.`;
          }
          break;

        case "weather":
          // Fetch weather data from OpenWeatherMap
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
              aiInput
            )}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );
          const weatherData = await weatherRes.json();

          if (weatherData.cod === "200") {
            const dailyForecasts = weatherData.list
              .filter((item, index) => index % 8 === 0) // Get one forecast per day
              .slice(0, 7); // 7 days forecast

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
              } | ${Math.round(forecast.main.temp)}-${Math.round(
                forecast.main.temp_max
              )} | ${forecast.main.humidity} | ${Math.round(
                forecast.wind.speed
              )} |`;
            });

            response = `## 7-Day Weather Forecast for ${aiInput}\n\n| Day | Date | Condition | Temp (°C) | Humidity (%) | Wind (km/h) |\n|-----|------|-----------|-----------|--------------|------------|\n${weatherTable.join(
              "\n"
            )}`;
          } else {
            response = `Weather data not found for ${aiInput}. Please try a different location.`;
          }
          break;

        case "dining":
          // Fetch restaurants and hotels from OpenTripMap
          const cityRes = await fetch(
            `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
              aiInput
            )}&apikey=${OPENTRIP_API_KEY}`
          );
          const cityData = await cityRes.json();

          if (cityData.status === "OK" && cityData.name) {
            const { lat, lon } = cityData;

            // Get restaurants
            const restaurantsRes = await fetch(
              `https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=${lon}&lat=${lat}&kinds=restaurants&apikey=${OPENTRIP_API_KEY}`
            );
            const restaurantsData = await restaurantsRes.json();

            // Get hotels
            const hotelsRes = await fetch(
              `https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=${lon}&lat=${lat}&kinds=hotels&apikey=${OPENTRIP_API_KEY}`
            );
            const hotelsData = await hotelsRes.json();

            const restaurants = restaurantsData.features
              .slice(0, 3)
              .map((place) => place.properties.name)
              .filter(Boolean);

            const hotels = hotelsData.features
              .slice(0, 3)
              .map((place) => place.properties.name)
              .filter(Boolean);

            response = `## 🍴 Dining Recommendations for ${
              cityData.name
            }\n\n${restaurants
              .map(
                (rest, i) =>
                  `**${
                    i === 0 ? "Budget" : i === 1 ? "Mid-Range" : "Fine Dining"
                  }:**\n* **Name:** ${rest}\n`
              )
              .join("\n")}\n## 🏨 Accommodation Recommendations\n\n${hotels
              .map(
                (hotel, i) =>
                  `**${
                    i === 0 ? "Budget" : i === 1 ? "Mid-Range" : "Luxury"
                  }:**\n* **Name:** ${hotel}\n`
              )
              .join("\n")}`;
          } else {
            response = `Location not found. Please try a different search term.`;
          }
          break;

        case "trip":
          const [destination, duration] = aiInput.split(" ");
          const days = parseInt(duration) || 5;

          // Fetch destination info from OpenTripMap
          const destRes = await fetch(
            `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
              destination
            )}&apikey=${OPENTRIP_API_KEY}`
          );
          const destData = await destRes.json();

          if (destData.status === "OK" && destData.name) {
            const { lat, lon, name, country } = destData;

            // Get attractions
            const attractionsRes = await fetch(
              `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${lon}&lat=${lat}&kinds=interesting_places&apikey=${OPENTRIP_API_KEY}`
            );
            const attractionsData = await attractionsRes.json();

            const attractions = attractionsData.features
              .slice(0, days * 2) // 2 attractions per day
              .map((place) => place.properties.name)
              .filter(Boolean);

            const itinerary = Array.from({ length: days }, (_, i) => {
              const dayAttractions = attractions.slice(i * 2, (i + 1) * 2);
              return `* **Day ${i + 1}:** ${dayAttractions.join(" & ")}`;
            });

            response = `## ✈️ Destination: ${name}, ${country}\n\n**⏳ Trip Duration:** ${days} Days\n\n**🗺️ Suggested Itinerary:**\n${itinerary.join(
              "\n"
            )}`;
          } else {
            response = `Destination not found. Please try a different search term.`;
          }
          break;
      }

      setAiResponse(response);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAiResponse(
        "Sorry, there was an error processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for weather emojis
  const getWeatherEmoji = (condition) => {
    const emojiMap = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Snow: "❄️",
      Thunderstorm: "⛈️",
      Drizzle: "🌦️",
      Mist: "🌫️",
      default: "⛅",
    };
    return emojiMap[condition] || emojiMap.default;
  };


  return (
    <div className="min-h-screen rounded-xl bg-gradient-to-br bg-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white p-3 md:p-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Travel Tools
        </h1>
        <p className="text-slate-400 mb-8">
          Essential tools to make your travels easier and safer
        </p>

        {/* Tool Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap border-b-2 border-slate-700 pb-4">
          {TABS.map(({ id, label, icon: Icon, activeColor }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? `bg-${activeColor}-600 text-white shadow-lg shadow-${activeColor}-500/50`
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        {/* Expense Tracker */}
        {activeTab === "expense" && (
          <ExpenseTracker/>
        )}

        {/* Currency Converter */}
        {activeTab === "currency" && (
          <CurrencyConverter />
        )}

        {/* Emergency Contacts */}
        {activeTab === "emergency" && (
          <Emergency/>
        )}

        {/* AI Assistant */}
        {activeTab === "ai" && (
          <AITravelAssistant/>
        )}
      </div>
    </div>
  );
}
