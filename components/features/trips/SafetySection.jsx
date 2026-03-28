"use client";

import React from "react";
import { Shield } from "lucide-react";

const SafetySection = ({ safetyTips }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid print:rounded-lg">
      <div className="flex items-center gap-2.5 px-6 pt-5 pb-2 print:px-4 print:pt-3 print:pb-2">
        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0 print:w-8 print:h-8 print:rounded">
          <Shield size={20} />
        </div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100 print:text-lg">
          Safety Tips
        </h2>
      </div>
      <div className="p-6 pt-2 print:p-3 print:pt-2">
        {safetyTips?.map((tip, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 py-2 border-b border-stone-100 dark:border-slate-700 last:border-b-0 print:py-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 flex-shrink-0 mt-2 print:mt-1" />
            <span className="text-sm text-stone-600 dark:text-slate-300 print:text-xs">
              {tip}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetySection;
