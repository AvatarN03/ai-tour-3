"use client";

import { GenPlanLoading } from "@/components/custom/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/useAuth";
import { generateTravelPlan } from "@/lib/AI_Model";
import { categories, initialForm, interests } from "@/lib/constant";
import { db } from "@/lib/firebase";
import { validateForm } from "@/lib/validation";
import { formatDate } from "date-fns";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AutoCompletion from "./AutoCompletion";

const currencyOptions = [
  { value: "USD", label: "USD - $" },
  { value: "INR", label: "INR - ₹" },
  { value: "EUR", label: "EUR - €" },
  { value: "GBP", label: "GBP - £" },
  { value: "AUD", label: "AUD - A$" },
  { value: "JPY", label: "JPY - ¥" },
];

const CreateTripForm = () => {
  // merge currency default with initialForm to avoid breaking other code
  const [formData, setFormData] = useState(initialForm);
  const { profile } = useAuth();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const saveTrip = async (tripData, aiGeneratedPlan) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "trips", docId), {
      id: docId,
      userId: profile?.uid,
      userEmail: profile?.email,
      userName: profile?.name,
      userSelection: tripData,
      GeneratedPlan: aiGeneratedPlan,
      createdAt: new Date(),
      updatedAt: new Date(),
      savedBy: [], // users who saved this trip
      // New field: currency stored at top-level for easy filtering/formatting
      currency: tripData.currency || "INR",
    });
    return docId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm({ setErrors, formData })) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const tripData = {
        ...formData,
        budget: parseFloat(formData.budget || 0),
        days: parseInt(formData.days || 0, 10),
        persons: parseInt(formData.persons || 1, 10),
        currency: formData.currency || "INR", // ensure currency included
      };
      toast.success("The Travel Plan is generating ...  hold on");
      setIsGenerating(true);
      const aiGeneratedPlan = await generateTravelPlan(tripData);

      const docId = await saveTrip(tripData, aiGeneratedPlan);
      setIsSubmitting(false);
      setIsGenerating(false);

      toast.success("Trip created successfully! 🎉");
      // Reset form (keep currency default)
      setFormData({ ...initialForm, currency: tripData.currency || "USD" });
      router.push("/saved/" + docId);
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Failed to create trip. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return <GenPlanLoading />;
  }

  return (
    <div className="bg-gradient-to-br w-full from-blue-200 via-blue-300 to-purple-500 dark:from-blue-500 dark:via-blue-800 dark:to-purple-900 py-8 px-4 sm:px-6 lg:px-8 rounded-md">
      <div className="max-w-7xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <span className="text-3xl">✈️</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Plan Your Dream Trip
          </h1>
          <p className="text-gray-600 text-base dark:text-gray-400">
            Fill in the details below to create your perfect travel experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-xl">📝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tell us about your trip
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trip Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-blue-500 ${
                    errors.title
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  placeholder="e.g., Amazing Weekend in Paris"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 cursor-pointer dark:text-white transition-all focus:ring-2 focus:ring-blue-500 ${
                    errors.category
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.category}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
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

          {/* Location Information */}
          <Card className="p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-xl">📍</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Location Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Where are you going?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination <span className="text-red-500">*</span>
                </label>
                <AutoCompletion
                  onPlaceSelect={(place) =>
                    setFormData((prev) => ({
                      ...prev,
                      destination: place.formattedAddress,
                    }))
                  }
                />
                {errors.destination && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.destination}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Starting From <span className="text-red-500">*</span>
                </label>
                <AutoCompletion
                  onPlaceSelect={(place) =>
                    setFormData((prev) => ({
                      ...prev,
                      source: place.formattedAddress,
                    }))
                  }
                />
                {errors.source && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.source}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Trip Details */}
          <Card className="p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-xl">📅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Trip Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Budget, dates, and travelers
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {formData.currency === "INR"
                      ? "₹"
                      : formData.currency === "EUR"
                      ? "€"
                      : formData.currency === "GBP"
                      ? "£"
                      : formData.currency === "JPY"
                      ? "¥"
                      : "$"}
                  </span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-purple-500 ${
                      errors.budget
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    placeholder="50000"
                  />
                </div>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.budget}
                  </p>
                )}
              </div>

              {/* Currency selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-purple-500 border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  {currencyOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleInputChange}
                  min={1}
                  max={7}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-purple-500 ${
                    errors.days
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  placeholder="3"
                />
                {errors.days && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.days}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Travelers <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="persons"
                  value={formData.persons}
                  onChange={handleInputChange}
                  min="1"
                  max={10}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-purple-500 ${
                    errors.persons
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  placeholder="2"
                />
                {errors.persons && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.persons}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-purple-500 ${
                    errors.startDate
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.startDate}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Interests */}
          <Card className="p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-xl">❤️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Interests & Preferences
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  What do you enjoy?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {interests.map((interest) => (
                <label
                  key={interest}
                  className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                    formData.interests.includes(interest)
                      ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-300"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-center">
                    {interest}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-xl">ℹ️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Additional Information
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Optional details for a better experience
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Accommodation Preferences
                </label>
                <textarea
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 transition-all"
                  placeholder="e.g., Hotel near city center, Airbnb with kitchen, Budget hostel..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transportation
                </label>
                <textarea
                  name="transportation"
                  value={formData.transportation}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 transition-all"
                  placeholder="e.g., Round-trip flight, Train passes, Rental car..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specific Activities
                </label>
                <textarea
                  name="activities"
                  value={formData.activities}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 transition-all"
                  placeholder="e.g., Visit Eiffel Tower, Wine tasting tour, Cooking class..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dietary Restrictions
                </label>
                <textarea
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="e.g., Vegetarian, Gluten-free, Nut allergy..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Any other special requests or notes for your trip..."
                />
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="sm:min-w-[140px] h-12 text-base font-medium"
              onClick={() => setFormData(initialForm)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="sm:min-w-[180px] h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
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
