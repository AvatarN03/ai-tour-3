"use client";

import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/features/trips/SectionHeader";
import { interests } from "@/lib/constants/trip";

export default function InterestsSection({ formData, onToggleInterest }) {
  return (
    <Card className="p-4 shadow-lg border-2 border-gray-100 dark:border-gray-700">
      <SectionHeader
        icon="❤️"
        color="bg-orange-500"
        title="Interests & Preferences"
        subtitle="What do you enjoy?"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {interests.map((interest) => {
          const active = formData.interests.includes(interest);
          return (
            <label
              key={interest}
              className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                active
                  ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-300"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggleInterest(interest)}
                className="sr-only"
              />
              <span className="text-sm font-medium text-center">{interest}</span>
            </label>
          );
        })}
      </div>
    </Card>
  );
}
