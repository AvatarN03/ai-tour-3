"use client";

import React from "react";
import {
  MapPin,
  Navigation,
  Users,
  Tag,
  Calendar,
  DollarSign,
} from "lucide-react";

const ICON_MAP = {
  MapPin: MapPin,
  Navigation: Navigation,
  Users: Users,
  Tag: Tag,
  Calendar: Calendar,
  DollarSign: DollarSign,
};

const HeroSection = ({ title, heroStats }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white px-6 md:px-8 py-6 md:py-8 print:break-inside-avoid print:py-4 print:px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-gray-300 font-semibold text-sm mb-2">Trip Name:</p>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 print:text-2xl print:mb-4">
          {title}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 print:grid-cols-2 print:gap-2">
          {heroStats.map(({ icon, iconSize, label, value, span }) => {
            const IconComponent = ICON_MAP[icon];
            return (
              <div
                key={label}
                className={`flex items-start gap-2.5 bg-white/10 border border-white/20 rounded-xl p-3 print:rounded-lg print:p-2 print:bg-white/5 print:border-white/10 ${
                  span || ""
                }`}
              >
                <span className="opacity-65 flex-shrink-0 mt-0.5">
                  {IconComponent && <IconComponent size={iconSize || 16} />}
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] opacity-60 tracking-wider uppercase print:text-[9px]">
                    {label}
                  </div>
                  <div className="text-sm font-semibold mt-0.5 print:text-xs break-words">
                    {value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
