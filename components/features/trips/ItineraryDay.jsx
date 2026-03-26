"use client";

import React from "react";

import {
  Clock,
  DollarSign,
  Sun,
  Navigation,
  Star,
  MapPin,
  Compass
} from "lucide-react";

import PlaceImage from "./PlaceImage";
import { getRatingStars } from "@/lib/utils";
import Link from "next/link";




const ItineraryDay = ({ dayData, destination }) => {
  if (!dayData?.plan?.length) {
    return (
      <p className="text-gray-700 dark:text-gray-300">
        No activities planned for this day.
      </p>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4 ">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 break-words text-center p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-2 border-blue-300 dark:border-blue-700 ">
        {dayData.day} - {dayData.theme || dayData.Theme}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {dayData.plan.map((activity, idx) => {
          // Google Maps URL
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            activity.place + ", " + destination
          )}`;

          const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${activity.geo_coordinates
            ? activity.geo_coordinates
            : encodeURIComponent(activity.place + ", " + destination)
            }`;
          return (
            <div
              key={idx}
              className="border rounded-lg md:rounded-xl overflow-hidden hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col">
                <div className="w-full h-48 md:h-56 bg-gray-200 dark:bg-gray-700">
                  <PlaceImage object={{ name: activity.place }} />
                </div>

                <div className="p-3 md:p-5 bg-white dark:bg-gray-800">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base md:text-lg font-bold mb-1 text-gray-900 dark:text-white leading-tight">
                        {activity.place}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs md:text-sm">
                        {activity.time}
                      </p>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {getRatingStars(activity.rating)}
                    </div>
                  </div>

                  <p className="mb-3 text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed">
                    {activity.details}
                  </p>

                  <div className="space-y-2 text-xs md:text-sm mb-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <DollarSign
                        size={14}
                        className="text-green-600 dark:text-green-400 flex-shrink-0"
                      />
                      <span className="break-words">
                        <strong>Price:</strong> {activity.ticket_pricing}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock
                        size={14}
                        className="text-orange-600 dark:text-orange-400 flex-shrink-0"
                      />
                      <span className="break-words">
                        <strong>Duration:</strong> {activity.time_to_spend}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Sun
                        size={14}
                        className="text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                      />
                      <span className="break-words">
                        <strong>Best time:</strong> {activity.best_time_to_visit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Navigation
                        size={14}
                        className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                      />
                      <span className="break-words">
                        <strong>Travel:</strong> {activity.travel_time_from_previous}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {/* Maps */}
                    <Link
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 bg-gray-900 hover:bg-black text-white text-xs md:text-sm rounded-md"
                    >
                      <MapPin size={14} />
                      Maps
                    </Link>

                    {/* Directions */}
                    <Link
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm rounded-md"
                    >
                      <Navigation size={14} />
                      Directions
                    </Link>

                    {/* Explore (Google Search) */}
                    <Link
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        activity.place + " " + destination
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm rounded-md"
                    >
                      <Compass size={14} />
                      Explore
                    </Link>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryDay;
