"use client";
import { Star } from "lucide-react";
import React, { useState } from "react";
import PlaceImage from "./PlaceImage";

// 2. Accept 'destination' as a prop
const Hotels = ({ hotel_options, destination }) => {
  const [selectedHotel, setSelectedHotel] = useState(0);

  const getRatingStars = (rating) => {
    const numRating = parseFloat(rating);
    return (
      <div className="flex items-center gap-1 flex-shrink-0">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < Math.floor(numRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }
          />
        ))}
        <span className="text-sm ml-1 text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {rating}
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hotel_options?.map((hotel, idx) => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          hotel.name + ", " + destination
        )}`;

        return (
          <div
            key={idx}
            onClick={() => setSelectedHotel(idx)}
            className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
              selectedHotel === idx
                ? "border-blue-600 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800"
                : "border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600"
            }`}
          >
            <div className="h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
              <PlaceImage key={idx} object={{ name: hotel.name }} />
            </div>
            <div className="p-4 bg-white dark:bg-gray-800">
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white break-words">
                {hotel.name}
              </h3>
              {getRatingStars(hotel.rating)}
              <p className="text-sm mt-2 mb-2 text-gray-600 dark:text-gray-400 break-words">
                {hotel.address}
              </p>
              <p className="text-sm mb-3 text-gray-700 dark:text-gray-300 break-words">
                {hotel.description}
              </p>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {hotel.price_per_night}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    per night
                  </p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black text-gray-400 hover:text-gray-300 rounded-md shadow-md"
                >
                  Check Out
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Hotels;
