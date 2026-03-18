"use client";

import { useState } from "react";
import { createTripAction } from "@/actions/trip/createTrip";
import { deleteTripAction } from "@/actions/trip/deleteTrip";
import { getTripsAction } from "@/actions/trip/getTrips";

export const useTrip = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleAsync = async (fn) => {
    try {
      setError(null);
      const res = await fn();

      if (!res?.success) {
        throw new Error(res?.error || "Something went wrong");
      }

      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  // ✅ CREATE
  const createTrip = async ({ formData, profile }) => {
    setLoading(true);
    setGenerating(true);

    return handleAsync(() => createTripAction({ formData, profile }));
  };

  // ✅ DELETE
  const deleteTrip = async ({ profile, tripId, plan }) => {
    setLoading(true);

    return handleAsync(() => deleteTripAction({ profile, tripId, plan }));
  };

  // ✅ GET ALL TRIPS
  const getTrips = async ({ userId, pageSize, cursor, searchQuery }) => {
    setLoading(true);
    setError(null);

    const res = await getTripsAction({
      userId,
      pageSize,
      cursor,
      searchQuery,
    });

    if (!res.success) setError(res.error);

    setLoading(false);
    return res;
  };

  // ✅ optional reset (VERY useful in UI)
  const resetState = () => {
    setLoading(false);
    setGenerating(false);
    setError(null);
  };

  return {
    createTrip,
    deleteTrip,
    getTrips,
    loading,
    generating,
    error,
    resetState,
  };
};
