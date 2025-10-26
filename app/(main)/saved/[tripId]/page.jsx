"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Star,
  Clock,
  Navigation,
  Hotel,
  Utensils,
  AlertCircle,
  Package,
  Sun,
  Share2,
  Download,
  Check,
  Copy,
  User,
  Mail,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { arrayUnion, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/useAuth";
import { ViewTripLoading } from "@/components/custom/Loading";
import Hotels from "./Hotels";
import ItineraryDay from "./ItineraryDay";

const printStyles = `
@media print {
  .no-print { display: none !important; }
  body { background: #fff !important; }
  #pdf-content { box-shadow: none !important; }
}
`;

const TripViewCard = () => {
  const [activeDay, setActiveDay] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { tripId } = useParams();
  const [plan, setPlanData] = useState(null);
  const [createdUser, setCreatedUser] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchPlanData();
  }, [tripId]);

  const fetchPlanData = async () => {
    try {
      const docRef = doc(db, "trips", tripId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("❌ No such document!");
        router.replace("/saved");
        return;
      }
      setPlanData(docSnap.data().GeneratedPlan);
      setCreatedUser(docSnap.data());
    } catch (error) {
      toast.error("🔥 Error fetching trip:", error.message);
    }
  };

  const savePlanToMyTrips = async () => {
    try {
      if (!plan) {
        toast.error("No plan data to save.");
        return;
      }

      if (!user) {
        router.replace(
          `/auth?redirect=${encodeURIComponent("/saved/" + tripId)}`
        );
      }
      const tripRef = doc(db, "trips", tripId);
      await updateDoc(tripRef, {
        savedBy: arrayUnion(user.email),
      });
      toast.success("Trip saved to your list!");
      router.push("/saved");
    } catch (error) {
      toast.error("Error saving trip:", error.message);
    }
  };

  const handleShareLink = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const getRatingStars = (rating) => {
    const numRating = parseFloat(rating);
    return (
      <div className="flex items-center gap-1 flex-shrink-0">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < Math.floor(numRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }
          />
        ))}
        <span className="text-sm ml-1 text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {rating}
        </span>
      </div>
    );
  };

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "object" && date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    const d = new Date(date);
    return isNaN(d) ? "" : d.toLocaleDateString();
  };

  // Currency symbol mapping
  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: "$",
      INR: "₹",
      EUR: "€",
      GBP: "£",
      AUD: "A$",
      JPY: "¥",
    };
    return symbols[currency] || currency;
  };

  if (!plan) {
    return <ViewTripLoading />;
  }
  const deleteTrip = async () => {
    if (!user) {
      toast.error("You must be logged in to delete a trip!");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this trip? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "trips", tripId));
      toast.success("Trip deleted successfully!");
      router.push("/saved");
    } catch (error) {
      toast.error("Error deleting trip: " + error.message);
    }
  };

  const currency = plan?.currency || "INR";
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <div className="max-w-5xl mx-auto p- md:p-6">
        {/* Action Buttons */}
        {/* Delete Button */}
        <button
          onClick={deleteTrip}
          className="px-4 py-2 flex justify-center items-center gap-2 cursor-pointer fixed bottom-5 right-5 rounded-full  bg-red-600 hover:bg-red-700 text-white font-bold  shadow-md transition"
        >
          <Trash />
          <p className="hidden md:block">Delete Trip</p>
        </button>

        {/* Header Section */}
        <div className="rounded-md md:rounded-2xl p-6 md:p-8 mb-6 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white overflow-hidden">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 break-words">
            {plan?.tripDetails?.title || `Trip to ${plan?.destination}`}
          </h1>
          <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={18} className="flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs opacity-80">Destination</p>
                <p className="font-semibold text-sm md:text-base truncate">
                  {plan?.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Calendar size={18} className="flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs opacity-80">Duration</p>
                <p className="font-semibold text-sm md:text-base truncate">
                  {plan?.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Users size={18} className="flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs opacity-80">Travel Type</p>
                <p className="font-semibold text-sm md:text-base truncate">
                  {plan?.travel_type}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <DollarSign size={18} className="flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs opacity-80">Total Budget ({currency})</p>
                <p className="font-semibold text-sm md:text-base truncate">
                  {plan?.total_estimated_cost}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Options Section */}
        <div className="rounded-xl md:rounded-2xl md:p-6 mb-6 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
          <div className="flex items-center gap-2 mb-4 p-2">
            <Hotel
              className="text-blue-600 dark:text-blue-400 flex-shrink-0"
              size={24}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Accommodation Options
            </h2>
          </div>
          {plan?.hotel_options?.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-300">
              No hotel options available for the selected preferences.
            </p>
          ) : (
            <Hotels
              hotel_options={plan?.hotel_options}
              destination={plan?.destination}
            />
          )}
        </div>

        {/* Itinerary Section */}
        {/* Activities for Selected Day */}
        <div className="rounded-xl md:rounded-2xl p-3 md:p-6 mb-6 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Navigation
              className="text-blue-600 dark:text-blue-400 flex-shrink-0"
              size={24}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Day-by-Day Itinerary
            </h2>
          </div>

          {/* Day Selector Dropdown */}
          <div className="mb-6">
            <select
              value={activeDay}
              onChange={(e) => setActiveDay(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg font-semibold text-base transition-all outline-none cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            >
              {plan?.itinerary?.map((day, idx) => (
                <option key={idx} value={idx}>
                  {day.day} - {day.theme || day.Theme}
                </option>
              ))}
            </select>
          </div>

          {/* Render Itinerary for the selected day */}
          <ItineraryDay dayData={plan?.itinerary?.[activeDay]} />
        </div>

        {/* Budget Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign
                className="text-green-600 dark:text-green-400 flex-shrink-0"
                size={24}
              />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Budget Breakdown ({currency})
              </h2>
            </div>
            <div className="space-y-3">
              {Object.entries(plan?.budget_breakdown || {}).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700 gap-4"
                  >
                    <span className="capitalize font-medium text-gray-700 dark:text-gray-300 break-words">
                      {key}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      {value}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Utensils
                className="text-orange-600 dark:text-orange-400 flex-shrink-0"
                size={24}
              />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Local Cuisine
              </h2>
            </div>
            <ul className="space-y-2">
              {plan?.local_cuisine?.map((food, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <span className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="break-words">{food}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle
                className="text-red-600 dark:text-red-400 flex-shrink-0"
                size={24}
              />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Safety Tips
              </h2>
            </div>
            <ul className="space-y-2">
              {plan?.safety_tips?.map((tip, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="break-words">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Package
                className="text-purple-600 dark:text-purple-400 flex-shrink-0"
                size={24}
              />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Packing Suggestions
              </h2>
            </div>
            <ul className="space-y-2">
              {plan?.packing_suggestions?.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <span className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="break-words">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transportation Tips */}
        <div className="rounded-xl md:rounded-2xl p-4 md:p-6 mt-6 border-l-4 bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-400 overflow-hidden">
          <h3 className="font-bold text-lg mb-2 text-blue-900 dark:text-blue-200">
            Transportation Tips
          </h3>
          <p className="text-gray-700 dark:text-gray-300 break-words">
            {plan?.transportation_tips}
          </p>
        </div>

        {/* Best Season */}
        <div className="rounded-xl md:rounded-2xl p-4 md:p-6 mt-6 border-l-4 bg-green-50 dark:bg-green-900/30 border-green-600 dark:border-green-400 overflow-hidden">
          <h3 className="font-bold text-lg mb-2 text-green-900 dark:text-green-200">
            Best Season to Visit
          </h3>
          <p className="text-gray-700 dark:text-gray-300 break-words">
            {plan?.best_season}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripViewCard;
