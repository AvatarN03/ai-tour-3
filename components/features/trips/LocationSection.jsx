"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/features/trips/FieldLabel";
import { SectionHeader } from "@/components/features/trips/SectionHeader";
import { FieldError } from "@/components/features/trips/FieldError";
import LocationComplete from "./LocationComplete";

export default function LocationSection({ formData, errors, onChange }) {
  const [useLocationComplete, setUseLocationComplete] = useState(false);

  return (
    <Card className="p-4 shadow-lg border-2 border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <SectionHeader
            icon="📍"
            color="bg-green-500"
            title="Location Details"
            subtitle="Where are you going?"
          />
        </div>
        {/* Toggle between Manual Input and Location Complete */}
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium transition-all ${
              !useLocationComplete
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            Manual
          </span>
          <button
            onClick={() => setUseLocationComplete(!useLocationComplete)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              useLocationComplete
                ? "bg-blue-600 dark:bg-blue-500"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
            title={
              useLocationComplete
                ? "Switch to manual input"
                : "Switch to location autocomplete"
            }
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                useLocationComplete ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-all ${
              useLocationComplete
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            Auto
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel label="Starting From" required />
          {useLocationComplete ? (
            <LocationComplete
              name="source"
              value={formData.source}
              onChange={onChange}
              placeholder="e.g., New York, USA"
              error={errors.source}
            />
          ) : (
            <Input
              type="text"
              name="source"
              value={formData.source || ""}
              onChange={onChange}
              placeholder="e.g., New York, USA"
              className={errors.source ? "border-red-500" : ""}
            />
          )}
          <FieldError msg={errors.source} />
        </div>
        <div>
          <FieldLabel label="Destination" required />
          {useLocationComplete ? (
            <LocationComplete
              name="destination"
              value={formData.destination}
              onChange={onChange}
              placeholder="e.g., Paris, France"
              error={errors.destination}
            />
          ) : (
            <Input
              type="text"
              name="destination"
              value={formData.destination || ""}
              onChange={onChange}
              placeholder="e.g., Paris, France"
              className={errors.destination ? "border-red-500" : ""}
            />
          )}
          <FieldError msg={errors.destination} />
        </div>
      </div>
    </Card>
  );
}
