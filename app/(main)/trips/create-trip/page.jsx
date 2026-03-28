"use client";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { GenPlanLoading } from "@/components/custom/Loading";
import BasicInfoSection from "@/components/features/trips/BasicInfoSection";
import LocationSection from "@/components/features/trips/LocationSection";
import TripDetailsSection from "@/components/features/trips/TripDetailsSection";
import InterestsSection from "@/components/features/trips/InterestsSection";
import AdditionalInfoSection from "@/components/features/trips/AdditionalInfoSection";
import FormActions from "@/components/features/trips/FormActions";

import { useAuth } from "@/context/useAuth";

import { useTrip } from "@/hooks/useTrip";

import { initialForm } from "@/lib/constants/trip";
import { validateForm } from "@/lib/validation/tripForm.js";
import {
  buildInitialFormFromParams,
  checkSubscriptionLimit,
  getResetFormData,
} from "@/lib/utils/createTripHelpers";



const CreateTripForm = () => {
  const searchParams = useSearchParams();

  // useMemo so this only runs once on mount, not on every render
  const prefilled = useMemo(
    () => buildInitialFormFromParams(searchParams),
    
    [] 
  );

  const [formData, setFormData] = useState(prefilled);
  const [errors, setErrors]     = useState({});

  const { profile }             = useAuth();
  const { createTrip, loading, generating } = useTrip();
  const router                  = useRouter();

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleReset = () => setFormData(getResetFormData());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm({ setErrors, formData })) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const subLimit = checkSubscriptionLimit(profile);
    if (!subLimit.allowed) {
      toast.error(subLimit.message);
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
          <BasicInfoSection formData={formData} errors={errors} onChange={handleInputChange} />
          <LocationSection formData={formData} errors={errors} onChange={handleInputChange} />
          <TripDetailsSection formData={formData} errors={errors} onChange={handleInputChange} />
          <InterestsSection formData={formData} onToggleInterest={handleInterestToggle} />
          <AdditionalInfoSection formData={formData} onChange={handleInputChange} />
          <FormActions loading={loading} onSubmit={handleSubmit} onReset={handleReset} />
        </form>
      </div>
    </div>
  );
};

export default CreateTripForm;