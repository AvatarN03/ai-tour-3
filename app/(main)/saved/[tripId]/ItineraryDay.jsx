"use client";

import React from "react";
import {
  Clock,
  DollarSign,
  Sun,
  Navigation,
  Star
} from "lucide-react";
import PlaceImage from "./PlaceImage";

// Rating stars helper
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

const ItineraryDay = ({ dayData, destination }) => {
  if (!dayData?.plan?.length) {
    return (
      <p className="text-gray-700 dark:text-gray-300">
        No activities planned for this day.
      </p>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 break-words text-center p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-2 border-blue-300 dark:border-blue-700">
        {dayData.day} - {dayData.theme || dayData.Theme}
      </h2>

      {dayData.plan.map((activity, idx) => {
        // Google Maps URL
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          activity.place + ", " + destination
        )}`;

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

                {/* Google Maps "Check Out" Button */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-4 py-2 mt-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Check Out on Maps
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItineraryDay;
