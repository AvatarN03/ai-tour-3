"use client";

import React from "react";
import { Briefcase } from "lucide-react";

const PackingSection = ({ packingSuggestions }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid print:rounded-lg">
      <div className="flex items-center gap-2.5 px-6 pt-5 pb-2 print:px-4 print:pt-3 print:pb-2">
        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0 print:w-8 print:h-8 print:rounded">
          <Briefcase size={20} />
        </div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100 print:text-lg">
          Packing Suggestions
        </h2>
      </div>
      <div className="p-6 pt-2 print:p-3 print:pt-2">
        {packingSuggestions?.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 py-2 border-b border-stone-100 dark:border-slate-700 last:border-b-0 print:py-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 flex-shrink-0 mt-2 print:mt-1" />
            <span className="text-sm text-stone-600 dark:text-slate-300 print:text-xs">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackingSection;
