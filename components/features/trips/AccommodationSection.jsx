"use client";

import React from "react";
import { Hotel } from "lucide-react";
import Hotels from "@/components/features/trips/Hotels";

const AccommodationSection = ({ hotelOptions, destination }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid print:rounded-lg">
      <div className="flex items-center gap-2.5 px-6 pt-5 pb-2 print:px-4 print:pt-3 print:pb-2">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 print:w-8 print:h-8 print:rounded">
          <Hotel size={20} />
        </div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100 print:text-lg">
          Accommodation Options
        </h2>
      </div>
      <div className="p-3 md:p-6 pt-2 print:p-3 print:pt-2">
        {!hotelOptions?.length ? (
          <p className="text-sm text-stone-500 dark:text-slate-400">
            No hotel options available for the selected preferences.
          </p>
        ) : (
          <Hotels hotel_options={hotelOptions} destination={destination} />
        )}
      </div>
    </div>
  );
};

export default AccommodationSection;
