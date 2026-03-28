"use client";

import React from "react";
import { Navigation, ChevronLeft, ChevronRight, Star } from "lucide-react";
import ItineraryDay from "@/components/features/trips/ItineraryDay";

const ItinerarySection = ({ itinerary, activeDay, onPrevDay, onNextDay, destination }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid print:rounded-lg">
      <div className="flex items-center gap-2.5 px-6 pt-5 pb-2 print:px-4 print:pt-3 print:pb-2">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 print:w-8 print:h-8 print:rounded">
          <Navigation size={20} />
        </div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100 print:text-lg">
          Day-by-Day Itinerary
        </h2>
      </div>
      <div className="p-3 md:p-6 pt-2 print:p-3 print:pt-2">
        {/* Day pill navigator (hidden on print) */}
        <div className="no-print flex items-center gap-2 mb-5">
          <button
            onClick={onPrevDay}
            disabled={activeDay === 0}
            className="w-9 h-9 rounded-lg border border-stone-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous day"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide" role="tablist">
            {itinerary.map((day, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={activeDay === idx}
                onClick={() => {}}
                className={`flex-shrink-0 px-4 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
                  activeDay === idx
                    ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-md"
                    : "bg-stone-50 dark:bg-slate-700 border-stone-200 dark:border-slate-600 text-stone-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-400"
                }`}
              >
                {day.day}
              </button>
            ))}
          </div>
          <button
            onClick={onNextDay}
            disabled={activeDay === itinerary.length - 1}
            className="w-9 h-9 rounded-lg border border-stone-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next day"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Screen view: show only active day */}
        <div className="no-print space-y-4">
          {itinerary[activeDay] && (
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-blue-950/20 dark:via-purple-950/20 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2">
              <Star size={14} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
              <span className="font-serif text-base font-semibold text-blue-800 dark:text-blue-300">
                {itinerary[activeDay].theme || itinerary[activeDay].Theme}
              </span>
            </div>
          )}
          <ItineraryDay dayData={itinerary[activeDay]} destination={destination} />
        </div>

        {/* Print view: show all days */}
        <div className="hidden print:block space-y-6">
          {itinerary.map((day, idx) => (
            <div key={idx} className="print:break-inside-avoid">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2 print:px-2 print:py-2 print:mb-3">
                <Star size={14} className="text-amber-500 flex-shrink-0" />
                <span className="font-serif text-base font-semibold text-blue-800 print:text-sm">
                  {day.theme || day.Theme}
                </span>
              </div>
              <ItineraryDay dayData={day} destination={destination} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItinerarySection;
