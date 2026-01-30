"use client";

import { useEffect, useState } from "react";
import { Bookmark, Loader, Loader2, MapPin, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { updateDoc, doc, arrayUnion } from "firebase/firestore";

import { useAuth } from "@/providers/useAuth";

import { db } from "@/lib/config/firebase";
import { useRouter } from "next/navigation";
import { getTripCategoryEmoji, getTripCategoryIcon } from "@/lib/utils/utils";

export default function TripRecommendations() {
  const { user, profile } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!user?.uid || !profile?.preferences) return;
    fetchRecommendations();
  }, [user, profile]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          userPreferences: profile.preferences || [],
        }),
      });

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async (tripId) => {
    setSavingId(tripId);
    try {
      await updateDoc(doc(db, "trips", tripId), {
        savedBy: arrayUnion(user.uid),
      });
      toast.success("Trip saved successfully!");
      fetchRecommendations();
      router.push(`/trips/${tripId}`);
    } catch (error) {
      toast.error("Failed to save trip");
      console.error(error);
    } finally {
      setSavingId(null);
    }
  };

  if (!recommendations.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✈️</div>
        <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
        <p className="text-gray-600">
          We'll find trips that match your interests soon!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 flex justify-start items-center gap-2">
          <Wand2 /> Recommended for You
        </h2>
        <p className="text-gray-700 dark:text-gray-500">
          Handpicked trips based on your interests
        </p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin " />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((trip) => ( 
              <div
                key={trip.id}
                className="group relative bg-white dark:bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-purple-500/30"
              >
                <div className="relative h-28 overflow-hidden bg-gradient-to-br dark:from-purple-600 from-purple-200 to-purple-100 flex-col">
                  <div className="w-full h-full flex items-center justify-center text-6xl flex-col gap-1">
                    {getTripCategoryEmoji(trip.category)}
                    <p className="text-sm font-bold p-1 rounded-md bg-purple-600 text-white">{trip.category}</p>
                  </div>

                <div className="absolute top-4 right-4 dark:bg-slate-700 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  {trip.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 h-16 flex justify-start items-center line-clamp-2">
                  {trip.title}
                </h3>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3 gap-2">
                  <MapPin />
                  <span className="font-medium">{trip.destination}</span>
                </div>

                {trip.theme && (
                  <p
                    title={trip.theme}
                    className="text-sm text-purple-500 dark:text-purple-300 mb-4 line-clamp-2 h-10 text-ellipsis"
                  >
                    {trip.theme}
                  </p>
                )}

                {/* Interests Tags */}
                <div className="flex flex-wrap gap-2 mb-4  h-20">
                  {trip.interests.slice(0, 3).map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-600 dark:bg-blue-200  text-indigo-100 dark:text-indigo-800 text-xs font-medium rounded-full flex justify-center items-center"
                    >
                      {interest}
                    </span>
                  ))}
                  {trip.interests.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex justify-center items-center">
                      +{trip.interests.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Budget</p>
                    <p className="text-lg font-bold">{trip.budget}</p>
                  </div>

                  <button
                    onClick={() => saveTrip(trip.id)}
                    disabled={savingId === trip.id}
                    className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end mb-0 cursor-pointer"
                  >
                    {savingId === trip.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Bookmark />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Best Season Badge */}
              {trip.bestSeason !== "N/A" && (
                <div className="absolute top-4 left-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  🌤️ {trip.bestSeason.split(" ")[0]}
                </div>
              )}
            </div>
            
          ))}
      </div>
      )}
    </div>
  );
}
