"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { GenPlanLoading } from "@/components/custom/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel } from "@/components/features/trips/FieldLabel";
import { SectionHeader } from "@/components/features/trips/SectionHeader";
import { FieldError } from "@/components/features/trips/FieldError";

import LocationComplete from "./LocationComplete";
import { useAuth } from "@/providers/useAuth";

import { useTrip } from "@/hooks/useTrip";

import { categories, createTripData, CURRENCY_OPTIONS, initialForm, interests } from "@/lib/constants";
import { validateForm } from "@/lib/validation/tripForm.js";
import { getCurrencySymbol, inputClass, selectClass } from "@/lib/utils";


const CreateTripForm = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const { profile } = useAuth();
  const { createTrip, loading, generating } = useTrip(); 
  const router = useRouter();



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleReset = () => setFormData(initialForm);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm({ setErrors, formData })) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (profile?.subscription === "free" && (profile?.tripCount ?? 0) >= 7) {
      toast.error("Free plan allows only 7 trips. Upgrade to Pro 🚀");
      return;
    }

    const res = await createTrip({ formData, profile });

    if (!res?.success) {
      toast.error("Failed to create trip. Please try again.");
      return;
    }

    toast.success("Trip created successfully! 🎉");
    router.push(`/trips/${res.docId}`);
  };

  if (generating) return <GenPlanLoading />;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gradient-to-br w-full from-blue-200 via-blue-300 to-purple-500 dark:from-blue-500 dark:via-blue-800 dark:to-purple-900 py-4 px-2 sm:px-6 rounded-md">
      <div className="max-w-7xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="flex items-start gap-2 mb-8 relative w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <span className="text-xl">✈️</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Plan Your Dream Trip
            </h1>
            <p className="text-gray-600 text-base dark:text-gray-200">
              Fill in the details below to create your perfect travel experience
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Basic Information ── */}
          <Card className="p-4 shadow-lg border-2 border-gray-100 dark:border-gray-700">
            <SectionHeader icon="📝" color="bg-blue-500" title="Basic Information" subtitle="Tell us about your trip" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FieldLabel label="Trip Title" required />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className={selectClass(errors.category, "focus:ring-blue-500")}
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
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Describe your trip plans, expectations, and what makes it special..."
                />
              </div>
            </div>
          </Card>

          {/* ── Location ── */}
          <Card className="p-4 shadow-lg border-2 border-gray-100 dark:border-gray-700">
            <SectionHeader icon="📍" color="bg-green-500" title="Location Details" subtitle="Where are you going?" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldLabel label="Starting From" required />
                <LocationComplete
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, USA"
                  error={errors.source}
                />
              </div>
              <div>
                <FieldLabel label="Destination" required />
                <LocationComplete
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="e.g., Paris, France"
                  error={errors.destination}
                />
              </div>
            </div>
          </Card>

          {/* ── Trip Details ── */}
          <Card className="p-4 shadow-lg border-2 border-gray-100 dark:border-gray-700">
            <SectionHeader icon="📅" color="bg-purple-500" title="Trip Details" subtitle="Budget, dates, and travelers" />

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
                    onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className={selectClass(null, "focus:ring-purple-500")}
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className={inputClass(errors.startDate, "focus:ring-purple-500")}
                />
                <FieldError msg={errors.startDate} />
              </div>
            </div>
          </Card>

          {/* ── Interests ── */}
          <Card className="p-4 shadow-lg border-2 border-gray-100 dark:border-gray-700">
            <SectionHeader icon="❤️" color="bg-orange-500" title="Interests & Preferences" subtitle="What do you enjoy?" />

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
                      onChange={() => handleInterestToggle(interest)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-center">
                      {interest}
                    </span>
                  </label>
                );
              })}
            </div>
          </Card>

          {/* ── Additional Information ── */}
          <Card className="p-4 shadow-lg border-2 border-gray-100 dark:border-gray-700">
            <SectionHeader icon="ℹ️" color="bg-teal-500" title="Additional Information" subtitle="Optional details for a better experience" />

            <div className="space-y-3 text-sm">
              {createTripData.map(({ name, label, placeholder, ring, rows = 1 }) => (
                <div key={name}>
                  <FieldLabel label={label} />
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    rows={rows}
                    className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 ${ring} transition-all`}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* ── Actions ── */}
          <div className="flex flex-row justify-start md:justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="destructive"
              disabled={loading}
              className="sm:min-w-[140px] h-12 text-base font-medium"
              onClick={handleReset}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading} // ✅ uses hook's loading state
              className="sm:min-w-[180px] h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Trip...</span>
                </div>
              ) : (
                <div className="flex text-white items-center justify-center space-x-2">
                  <span>✈️</span>
                  <span>Create Trip</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTripForm;






