"use client";

import { Card } from "@/components/ui/card";
import { FieldLabel } from "@/components/features/trips/FieldLabel";
import { SectionHeader } from "@/components/features/trips/SectionHeader";
import { FieldError } from "@/components/features/trips/FieldError";
import { inputClass } from "@/lib/utils";

export default function BasicInfoSection({ formData, errors, onChange }) {
  const { categories } = require("@/lib/constants/trip");

  return (
    <Card className="p-4 shadow-lg border-2 border-gray-100 dark:border-gray-700">
      <SectionHeader
        icon="📝"
        color="bg-blue-500"
        title="Basic Information"
        subtitle="Tell us about your trip"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FieldLabel label="Trip Title" required />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            className={inputClass(errors.title)}
            placeholder="e.g., Amazing Weekend in Paris"
          />
          <FieldError msg={errors.title} />
        </div>

        <div>
          <FieldLabel label="Category" required />
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer transition-all focus:ring-2 focus:ring-blue-500 ${
              errors.category ? "border-red-500" : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <FieldError msg={errors.category} />
        </div>

        <div className="md:col-span-2">
          <FieldLabel label="Description" />
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Describe your trip plans, expectations, and what makes it special..."
          />
        </div>
      </div>
    </Card>
  );
}
