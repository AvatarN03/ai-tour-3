"use client";

import { Card } from "@/components/ui/card";
import { FieldLabel } from "@/components/features/trips/FieldLabel";
import { SectionHeader } from "@/components/features/trips/SectionHeader";
import { createTripData } from "@/lib/constants/trip";

export default function AdditionalInfoSection({ formData, onChange }) {
  return (
    <Card className="p-4 shadow-lg border-2 border-gray-100 dark:border-gray-700">
      <SectionHeader
        icon="ℹ️"
        color="bg-teal-500"
        title="Additional Information"
        subtitle="Optional details for a better experience"
      />

      <div className="space-y-3 text-sm">
        {createTripData.map(({ name, label, placeholder, ring, rows = 1 }) => (
          <div key={name}>
            <FieldLabel label={label} />
            <textarea
              name={name}
              value={formData[name]}
              onChange={onChange}
              rows={rows}
              className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 ${ring} transition-all`}
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
