"use client";

import { Card } from "@/components/ui/card";
import { FieldLabel } from "@/components/features/trips/FieldLabel";
import { SectionHeader } from "@/components/features/trips/SectionHeader";
import { FieldError } from "@/components/features/trips/FieldError";
import { getCurrencySymbol, inputClass, selectClass } from "@/lib/utils";
import { CURRENCY_OPTIONS } from "@/lib/constants";

export default function TripDetailsSection({ formData, errors, onChange }) {
  return (
    <Card className="p-4 shadow-lg border-2 border-gray-100 dark:border-gray-700">
      <SectionHeader
        icon="📅"
        color="bg-purple-500"
        title="Trip Details"
        subtitle="Budget, dates, and travelers"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Budget */}
        <div>
          <FieldLabel label="Budget" required />
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              {getCurrencySymbol(formData.currency)}
            </span>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={onChange}
              min="0"
              step="0.01"
              className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-purple-500 ${
                errors.budget ? "border-red-500" : "border-gray-200 dark:border-gray-700"
              }`}
              placeholder="50000"
            />
          </div>
          <FieldError msg={errors.budget} />
        </div>

        {/* Currency */}
        <div>
          <FieldLabel label="Currency" />
          <select
            name="currency"
            value={formData.currency}
            onChange={onChange}
            className={selectClass(null, "focus:ring-purple-500")}
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <FieldLabel label="Duration (days)" required />
          <input
            type="number"
            name="days"
            value={formData.days}
            onChange={onChange}
            min={1}
            max={7}
            className={inputClass(errors.days, "focus:ring-purple-500")}
            placeholder="3"
          />
          <FieldError msg={errors.days} />
        </div>

        {/* Travelers */}
        <div>
          <FieldLabel label="Travelers" required />
          <input
            type="number"
            name="persons"
            value={formData.persons}
            onChange={onChange}
            min="1"
            max={10}
            className={inputClass(errors.persons, "focus:ring-purple-500")}
            placeholder="2"
          />
          <FieldError msg={errors.persons} />
        </div>

        {/* Start Date */}
        <div>
          <FieldLabel label="Start Date" required />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={onChange}
            className={inputClass(errors.startDate, "focus:ring-purple-500")}
          />
          <FieldError msg={errors.startDate} />
        </div>
      </div>
    </Card>
  );
}
