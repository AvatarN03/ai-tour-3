"use client";

import React from "react";
import { Bus, Sun } from "lucide-react";

const InfoBannersSection = ({ transportationTips, bestSeason }) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-5 border-l-4 border-blue-500 dark:border-blue-400 flex gap-3.5 items-start print:rounded-lg print:p-3 print:text-sm">
        <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5 print:mt-0">
          <Bus size={18} />
        </div>
        <div>
          <div className="text-xs font-bold tracking-wider uppercase mb-1.5 text-blue-700 dark:text-blue-400 print:text-[10px] print:mb-1">
            Transportation Tips
          </div>
          <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed print:text-xs print:leading-snug">
            {transportationTips}
          </p>
        </div>
      </div>
      <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-5 border-l-4 border-green-500 dark:border-green-400 flex gap-3.5 items-start print:rounded-lg print:p-3 print:text-sm">
        <div className="flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5 print:mt-0">
          <Sun size={18} />
        </div>
        <div>
          <div className="text-xs font-bold tracking-wider uppercase mb-1.5 text-green-700 dark:text-green-400 print:text-[10px] print:mb-1">
            Best Season to Visit
          </div>
          <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed print:text-xs print:leading-snug">
            {bestSeason}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBannersSection;
