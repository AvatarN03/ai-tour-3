"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, Trash } from "lucide-react";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";

import { Button } from "@/components/ui/button";
import { ViewTripLoading } from "@/components/custom/Loading";

import PrintHeader from "@/components/features/trips/PrintHeader";
import HeroSection from "@/components/features/trips/HeroSection";
import AccommodationSection from "@/components/features/trips/AccommodationSection";
import ItinerarySection from "@/components/features/trips/ItinerarySection";
import BudgetSection from "@/components/features/trips/BudgetSection";
import CuisineSection from "@/components/features/trips/CuisineSection";
import SafetySection from "@/components/features/trips/SafetySection";
import PackingSection from "@/components/features/trips/PackingSection";
import InfoBannersSection from "@/components/features/trips/InfoBannersSection";

import { useAuth } from "@/context/useAuth";

import { useTrip } from "@/hooks/useTrip";

import { CURRENCY_SYMBOLS, buildHeroStats } from "@/lib/constants/tripView";

const TripViewCard = () => {
  const [activeDay, setActiveDay] = useState(0);
  const [plan, setPlanData] = useState(null);
  const { tripId } = useParams();
  const { profile, user, setProfile } = useAuth();
  const router = useRouter();
  const { deleteTrip, getTrip, loading } = useTrip();
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: plan?.tripDetails?.title || `Trip to ${plan?.destination}`,
    pageStyle: `
      @page { 
        size: A4; 
        margin: 15mm 20mm; 
      }
      @media print { 
        * { 
          -webkit-print-color-adjust: exact !important; 
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        html, body { 
          margin: 0; 
          padding: 0; 
          background: white !important;
        }
        .no-print { 
          display: none !important; 
        }
        .print-break-inside-avoid { 
          break-inside: avoid; 
        }
        .hidden.print\\:block {
          display: block !important;
        }
        img {
          max-width: 100% !important;
          height: auto !important;
        }
      }
    `,
  });

  useEffect(() => {
    if (profile?.uid && tripId) fetchPlanData();
  }, [tripId, profile?.uid]);

  const fetchPlanData = async () => {
    const res = await getTrip({ userId: profile.uid, tripId });
    if (!res.success) {
      toast.error("❌ " + res.error);
      router.replace("/trips");
      return;
    }
    setPlanData(res.data.GeneratedPlan);
  };

  const handleDelete = async () => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    if (!confirm("Are you sure you want to delete this trip?")) return;
    const res = await deleteTrip({ profile, tripId, plan });
    if (res.success) {
      setProfile((prev) => ({ ...prev, tripCount: prev.tripCount - 1 }));
      toast.success("Trip deleted successfully!");
      router.push("/trips");
    } else {
      toast.error(res.error);
    }
  };

  if (!plan) return <ViewTripLoading />;

  const currency = plan?.currency || "INR";
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  const title = plan?.tripDetails?.title || `Trip to ${plan?.destination}`;
  const itinerary = plan?.itinerary || [];
  const heroStats = buildHeroStats(plan, currency, sym);

  const prevDay = () => setActiveDay((d) => Math.max(0, d - 1));
  const nextDay = () => setActiveDay((d) => Math.min(itinerary.length - 1, d + 1));

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-900 text-gray-700 dark:text-slate-300 transition-colors">
      {/* Top action bar (hidden on print) */}
      <div className="no-print bg-amber-50/50 dark:bg-slate-800/50 border-b border-stone-200 dark:border-slate-700 px-5 py-3 flex justify-end gap-2.5 print:hidden">
        <Button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all border border-amber-300/40 dark:border-amber-500/30 bg-amber-100/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-200/50 dark:hover:bg-amber-900/40 cursor-pointer"
        >
          <Printer size={18} />
          <span className="hidden md:block">Print / Save PDF</span>
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all border border-red-300/40 dark:border-red-500/30 bg-red-100/50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200/50 dark:hover:bg-red-900/40 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
        >
          <Trash size={18} />
          <span className="hidden md:block">{loading ? "Deleting…" : "Delete Trip"}</span>
        </Button>
      </div>

      {/* Printable area */}
      <div ref={printRef}>
        <PrintHeader tripName={title} />

        {/* Hero Section */}
        <HeroSection title={title} heroStats={heroStats} />

        {/* Page body */}
        <div className="px-2 md:px-6 py-6 md:py-10 space-y-6">

          {/* Accommodation */}
          <AccommodationSection
            hotelOptions={plan?.hotel_options}
            destination={plan?.destination}
          />

          {/* Itinerary */}
          <ItinerarySection
            itinerary={itinerary}
            activeDay={activeDay}
            onPrevDay={prevDay}
            onNextDay={nextDay}
            destination={plan?.destination}
          />

          {/* Budget + Cuisine 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BudgetSection
              budgetBreakdown={plan?.budget_breakdown}
              currency={currency}
            />
            <CuisineSection cuisineList={plan?.local_cuisine} />
          </div>

          {/* Safety + Packing 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SafetySection safetyTips={plan?.safety_tips} />
            <PackingSection packingSuggestions={plan?.packing_suggestions} />
          </div>

          {/* Info banners */}
          <InfoBannersSection
            transportationTips={plan?.transportation_tips}
            bestSeason={plan?.best_season}
          />

        </div>
      </div>
    </div>
  );
};

export default TripViewCard;