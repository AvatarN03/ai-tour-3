"use client";

import React from "react";
import { DollarSign } from "lucide-react";

const BudgetSection = ({ budgetBreakdown, currency }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid print:rounded-lg">
      <div className="flex items-center gap-2.5 px-6 pt-5 pb-2 print:px-4 print:pt-3 print:pb-2">
        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0 print:w-8 print:h-8 print:rounded">
          <DollarSign size={20} />
        </div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100 print:text-lg">
          Budget Breakdown
        </h2>
      </div>
      <div className="p-6 pt-2 print:p-3 print:pt-2">
        <div className="text-[11px] tracking-wider uppercase text-stone-400 dark:text-slate-500 mb-2.5 font-semibold print:text-[10px] print:mb-2">
          All amounts in {currency}
        </div>
        {Object.entries(budgetBreakdown || {}).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-baseline py-3 border-b border-stone-100 dark:border-slate-700 last:border-b-0 gap-3 print:py-2 print:text-sm"
          >
            <span className="text-xs font-medium text-stone-500 dark:text-slate-400 capitalize print:text-xs">
              {key}
            </span>
            <span className="text-sm font-bold text-stone-800 dark:text-slate-200 text-right print:text-xs">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetSection;
