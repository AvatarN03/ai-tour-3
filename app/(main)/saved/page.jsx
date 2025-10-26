"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/context/useAuth";
import { Calendar, Clock, DollarSign, MapPin } from "lucide-react";

export default function SavedTripsPage() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [myTrips, setMyTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!profile?.email) return;

      const tripsRef = collection(db, "trips");

      // Trips created by me
      const qCreated = query(tripsRef, where("userEmail", "==", profile.email));
      const createdSnapshot = await getDocs(qCreated);
      const createdTrips = createdSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Trips saved by me
      const qSaved = query(
        tripsRef,
        where("savedBy", "array-contains", profile.email)
      );
      const savedSnapshot = await getDocs(qSaved);
      const savedTrips = savedSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Merge and remove duplicates (if user saved their own trip)
      const mergedTrips = [
        ...createdTrips,
        ...savedTrips.filter(
          (t) => !createdTrips.some((c) => c.id === t.id)
        ),
      ];

      setMyTrips(mergedTrips);
    };

    fetchTrips();
  }, [profile?.email]);

  // Filter trips based on search query (title or destination)
  const filteredTrips = useMemo(() => {
    if (!searchQuery) return myTrips;

    return myTrips.filter((trip) => {
      const title =
        trip.tripDetails?.title ||
        trip.userSelection?.title ||
        trip.title ||
        "";
      const destination =
        trip.userSelection?.destination ||
        trip.tripDetails?.destination ||
        trip.destination ||
        "";

      return (
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, myTrips]);

  // Currency symbol helper
  const getCurrencySymbol = (currency = "USD") => {
    const map = {
      USD: "$",
      EUR: "€",
      INR: "₹",
      GBP: "£",
      JPY: "¥",
      AUD: "A$",
      CAD: "C$",
      SGD: "S$",
      CNY: "¥",
    };
    return map[currency.toUpperCase()] || "$";
  };

  // Format date utility
  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "object" && date.toDate) return date.toDate().toLocaleDateString();
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-4 min-h-screen w-full px-3 md:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row  w-full sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Saved Trips
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and explore travel plans
          </p>
        </div>
        <Link href="/saved/create-trip">
          <Button className="w-full sm:w-auto cursor-pointer">
            + Create New Trip
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-accent w-full rounded-md p-2 sm:p-6 my-6">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <Button className="w-full sm:w-auto" onClick={() => {}}>
            Search
          </Button>
        </div>
      </div>

      {/* Trips List */}
      <div className="">
        <div className="grid gap-6 border-b-2 rounded-md md:p-8">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <Card
                key={trip.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                <div className="p-3 sm:p-6">
                  <div className="flex flex-col lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          ✈️
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                            {trip.tripDetails?.title ||
                              trip.userSelection?.title ||
                              trip.title ||
                              "Untitled Trip"}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium">
                              {trip.userSelection?.destination ||
                                trip.tripDetails?.destination ||
                                trip.destination ||
                                "Unknown Destination"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Trip details grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 w-full">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md w-full">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Saved
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {formatDate(trip.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md w-full">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Budget
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {getCurrencySymbol(
                                trip.userSelection?.currency || trip.currency
                              )}{" "}
                              {trip.userSelection?.budget || trip.budget || 0}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md w-full">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Duration
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {trip.userSelection?.days || trip.duration || 0}{" "}
                              days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/saved/${trip.id}`}
                      className=" px-6 py-3 w-full  text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No trips found</p>
          )}
        </div>
      </div>
    </div>
  );
}
