"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin, Calendar, Users, DollarSign, Navigation,
  Hotel, Utensils, Printer, ChevronLeft, ChevronRight,
  Compass, Sun, Shield, Briefcase, Bus, Star,
  Trash,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import { ViewTripLoading } from "@/components/custom/Loading";
import Hotels from "@/components/features/trips/Hotels";
import ItineraryDay from "@/components/features/trips/ItineraryDay";
import { useAuth } from "@/context/useAuth";
import { useTrip } from "@/hooks/useTrip";
import { useReactToPrint } from "react-to-print";
import PrintHeader from "@/components/features/trips/PrintHeader";
import { Button } from "@/components/ui/button";

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
      @page { size: A4; margin: 15mm 20mm; }
      @media print { 
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .no-print { display: none !important; }
        .print-break-inside-avoid { break-inside: avoid; }
      }
    `,
  });

  useEffect(() => {
    if (profile?.uid && tripId) fetchPlanData();
  }, [tripId, profile?.uid]);

  const fetchPlanData = async () => {
    const res = await getTrip({ userId: profile.uid, tripId });
    if (!res.success) { toast.error("❌ " + res.error); router.replace("/trips"); return; }
    setPlanData(res.data.GeneratedPlan);
  };

  const handleDelete = async () => {
    if (!user) { toast.error("You must be logged in"); return; }
    if (!confirm("Are you sure you want to delete this trip?")) return;
    const res = await deleteTrip({ profile, tripId, plan });
    if (res.success) {
      setProfile((prev) => ({ ...prev, tripCount: prev.tripCount - 1 }));
      toast.success("Trip deleted successfully!");
      router.push("/trips");
    } else { toast.error(res.error); }
  };

  if (!plan) return <ViewTripLoading />;

  const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£", AUD: "A$", JPY: "¥" };
  const currency = plan?.currency || "INR";
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  const title = plan?.tripDetails?.title || `Trip to ${plan?.destination}`;
  const itinerary = plan?.itinerary || [];

  const prevDay = () => setActiveDay((d) => Math.max(0, d - 1));
  const nextDay = () => setActiveDay((d) => Math.min(itinerary.length - 1, d + 1));

  const HERO_STATS = [
    {
      icon: <MapPin size={16} />,
      label: "Destination",
      value: plan?.destination,
      span: "col-span-full md:col-span-2",
    },
    {
      icon: <Navigation size={16} />,
      label: "Source",
      value: plan?.tripDetails?.source || plan?.source,
      span: "col-span-full md:col-span-2",
    },
    {
      icon: <Users size={16} />,
      label: "Travel Type",
      value: plan?.travel_type,
    },
    {
      icon: <Tag size={16} />,
      label: "Category",
      value: plan?.tripDetails?.category || plan?.category,
    },
    {
      icon: <Calendar size={16} />,
      label: "Duration",
      value: plan?.duration,
    },
    {
      icon: <DollarSign size={16} />,
      label: `Budget (${currency})`,
      value: `${sym} ${plan?.total_estimated_cost}`,
    },
  ];

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
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white px-6 md:px-8 py-6 md:py-8 print:break-inside-avoid">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(212,130,10,0.22)_0%,transparent_58%),radial-gradient(circle_at_12%_82%,rgba(45,125,168,0.22)_0%,transparent_52%)]" />
            <div className="absolute inset-[-50%] bg-[radial-gradient(circle,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[length:28px_28px] -rotate-6" />
          </div>

          <div className="relative max-w-5xl mx-auto">
            <p className="text-gray-500 font-semibold text-sm">Trip Name:</p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              {title}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {HERO_STATS.map(({ icon, label, value, span }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 transition-all hover:bg-white/20 ${span || ""}`}
                >
                  <span className="opacity-65 flex-shrink-0">{icon}</span>
                  <div>
                    <div className="text-[10px] opacity-60 tracking-wider uppercase">{label}</div>
                    <div className="text-sm font-semibold mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page body */}
        <div className="px-2 md:px-6 py-6 md:py-10 space-y-6">

          {/* Accommodation */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid">
            <div className="flex items-center gap-2.5 px-6 pt-5 pb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                <Hotel size={20} />
              </div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100">Accommodation Options</h2>
            </div>
            <div className="p-3 md:p-6 pt-2">
              {!plan?.hotel_options?.length
                ? <p className="text-sm text-stone-500 dark:text-slate-400">No hotel options available for the selected preferences.</p>
                : <Hotels hotel_options={plan.hotel_options} destination={plan?.destination} />
              }
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid">
            <div className="flex items-center gap-2.5 px-6 pt-5 pb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                <Navigation size={20} />
              </div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100">Day-by-Day Itinerary</h2>
            </div>
            <div className="p-3 md:p-6 pt-2">
              {/* Day pill navigator */}
              <div className="flex items-center gap-2 mb-5">
                <button
                  onClick={prevDay}
                  disabled={activeDay === 0}
                  className="w-9 h-9 rounded-lg border border-stone-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous day"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide" role="tablist">
                  {itinerary.map((day, idx) => (
                    <button
                      key={idx}
                      role="tab"
                      aria-selected={activeDay === idx}
                      onClick={() => setActiveDay(idx)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${activeDay === idx
                        ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-md"
                        : "bg-stone-50 dark:bg-slate-700 border-stone-200 dark:border-slate-600 text-stone-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-400"
                        }`}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>
                <button
                  onClick={nextDay}
                  disabled={activeDay === itinerary.length - 1}
                  className="w-9 h-9 rounded-lg border border-stone-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next day"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day theme badge */}
              {itinerary[activeDay] && (
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-blue-950/20 dark:via-purple-950/20 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2">
                  <Star size={14} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
                  <span className="font-serif text-base font-semibold text-blue-800 dark:text-blue-300">
                    {itinerary[activeDay].theme || itinerary[activeDay].Theme}
                  </span>
                </div>
              )}

              <ItineraryDay dayData={itinerary[activeDay]} destination={plan?.destination} />
            </div>
          </div>

          {/* Budget + Cuisine 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid">
              <div className="flex items-center gap-2.5 px-6 pt-5 pb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <DollarSign size={20} />
                </div>
                <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100">Budget Breakdown</h2>
              </div>
              <div className="p-6 pt-2">
                <div className="text-[11px] tracking-wider uppercase text-stone-400 dark:text-slate-500 mb-2.5 font-semibold">
                  All amounts in {currency}
                </div>
                {Object.entries(plan?.budget_breakdown || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-baseline py-3 border-b border-stone-100 dark:border-slate-700 last:border-b-0 gap-3">
                    <span className="text-xs font-medium text-stone-500 dark:text-slate-400 capitalize">{key}</span>
                    <span className="text-sm font-bold text-stone-800 dark:text-slate-200 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid">
              <div className="flex items-center gap-2.5 px-6 pt-5 pb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                  <Utensils size={20} />
                </div>
                <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100">Local Cuisine</h2>
              </div>
              <div className="p-6 pt-2">
                {plan?.local_cuisine?.map((food, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 py-2 border-b border-stone-100 dark:border-slate-700 last:border-b-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 flex-shrink-0 mt-2" />
                    <span className="text-sm text-stone-600 dark:text-slate-300">{food}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Safety + Packing 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid">
              <div className="flex items-center gap-2.5 px-6 pt-5 pb-2">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                  <Shield size={20} />
                </div>
                <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100">Safety Tips</h2>
              </div>
              <div className="p-6 pt-2">
                {plan?.safety_tips?.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 py-2 border-b border-stone-100 dark:border-slate-700 last:border-b-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 flex-shrink-0 mt-2" />
                    <span className="text-sm text-stone-600 dark:text-slate-300">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/30 overflow-hidden transition-colors print:shadow-none print:break-inside-avoid">
              <div className="flex items-center gap-2.5 px-6 pt-5 pb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100">Packing Suggestions</h2>
              </div>
              <div className="p-6 pt-2">
                {plan?.packing_suggestions?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 py-2 border-b border-stone-100 dark:border-slate-700 last:border-b-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 flex-shrink-0 mt-2" />
                    <span className="text-sm text-stone-600 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info banners */}
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-5 border-l-4 border-blue-500 dark:border-blue-400 flex gap-3.5 items-start">
              <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5">
                <Bus size={18} />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider uppercase mb-1.5 text-blue-700 dark:text-blue-400">Transportation Tips</div>
                <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed">{plan?.transportation_tips}</p>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-5 border-l-4 border-green-500 dark:border-green-400 flex gap-3.5 items-start">
              <div className="flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5">
                <Sun size={18} />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider uppercase mb-1.5 text-green-700 dark:text-green-400">Best Season to Visit</div>
                <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed">{plan?.best_season}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripViewCard;