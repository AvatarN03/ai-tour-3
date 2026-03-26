"use client";
import React, { useState } from "react";

import { ExternalLink, Hotel, MapPin, Star } from "lucide-react";

import PlaceImage from "./PlaceImage";
import { getRatingStars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 2. Accept 'destination' as a prop
const Hotels = ({ hotel_options, destination }) => {
  const [selectedHotel, setSelectedHotel] = useState(0);





  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hotel_options?.map((hotel, idx) => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          hotel.name + ", " + destination
        )}`;

        const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
          hotel.name + ", " + destination
        )}`;

        const agodaUrl = `https://www.agoda.com/search?text=${encodeURIComponent(
          hotel.name + ", " + destination
        )}`;

        const googleHotelsUrl = `https://www.google.com/travel/hotels/${encodeURIComponent(
          destination
        )}?q=${encodeURIComponent(hotel.name)}`;

        const expediaUrl = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destination)}&keyword=${encodeURIComponent(hotel.name)}`

        return (
          <div
            key={idx}
            onClick={() => setSelectedHotel(idx)}
            className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${selectedHotel === idx
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
              <div className="flex justify-end items-center text-right">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {hotel.price_per_night}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    per night
                  </p>
                </div>

              </div>
              <div className="p-2">
                {/* Enhanced Title Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r dark:from-gray-200 from-gray-900 to-gray-600 dark:to-gray-400 bg-clip-text text-transparent">
                      Check out
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 ml-3">
                    Book your stay or find the location
                  </p>
                </div>

                <div className="grid grid-cols-2  gap-2 my-2">
                  {/* Booking */}
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <Link className="flex items-center" href={bookingUrl} target="_blank" rel="noopener noreferrer">
                      <Hotel className="w-4 h-4 mr-0.5" />
                      Booking
                    </Link>
                  </Button>

                  {/* Expedia */}
                  <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg transition-all duration-200">
                    <Link className="flex items-center" href={expediaUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-0.5" />
                      Expedia
                    </Link>
                  </Button>

                  {/* Google Hotels */}
                  <Button asChild className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <Link className="flex items-center" href={googleHotelsUrl} target="_blank" rel="noopener noreferrer">
                      <Hotel className="w-4 h-4 mr-0.5" />
                      Hotels
                    </Link>
                  </Button>

                  {/* Maps */}
                  <Button asChild className="bg-gray-900 hover:bg-black text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <Link className="flex items-center" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                      <MapPin className="w-4 h-4 mr-0.5" />
                      Maps
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Hotels;
