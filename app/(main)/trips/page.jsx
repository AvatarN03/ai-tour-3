"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { Calendar, Clock, DollarSign, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { db } from "@/lib/config/firebase";
import { formatDate } from "@/lib/utils/blogHelpers";
import { PAGE_SIZE } from "@/lib/constants";

import { useAuth } from "@/providers/useAuth";
import { useTrip } from "@/hooks/useTrip";
import { toDate } from "@/lib/utils";



export default function SavedTripsPage() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [myTrips, setMyTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { getTrips, loading } = useTrip();

  // Stack of page cursors: index 0 = page 1 start (null), index 1 = page 2 start, etc.
  const pageCursors = useRef([null]);

  const fetchTrips = async (pageNum = 1, search = "") => {
    if (!profile?.uid) return;

    const cursor = pageCursors.current[pageNum - 1];

    const res = await getTrips({
      userId: profile.uid,
      pageSize: PAGE_SIZE,
      cursor,
      searchQuery: search,
    });

    if (!res.success) {
      console.error(res.error);
      return;
    }

    setMyTrips(res.data);

    // Save cursor for next page
    if (res.lastDoc && !pageCursors.current[pageNum]) {
      pageCursors.current[pageNum] = res.lastDoc;
    }

    // Optional: total count (keep your existing logic or optimize later)
  };

  useEffect(() => {
    fetchTrips(page, searchQuery);
  }, [profile?.uid, page, searchQuery]);

  const handleSearch = () => {
    pageCursors.current = [null];
    setPage(1);
    setSearchQuery(inputValue);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    pageCursors.current = [null];
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const isSearchMode = searchQuery.trim().length > 0;

  const getCurrencySymbol = (currency = "USD") => {
    const map = {
      USD: "$", EUR: "€", INR: "₹", GBP: "£",
      JPY: "¥", AUD: "A$", CAD: "C$", SGD: "S$", CNY: "¥",
    };
    return map[currency?.toUpperCase()] || "$";
  };

  return (
    <div className="p-4 min-h-screen w-full px-3 md:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row w-full sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Trips Inbox
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and explore travel plans
          </p>
        </div>
        <Link href="/trips/create-trip">
          <Button className="w-full sm:w-auto cursor-pointer p-2">
            <Plus className="w-3 h-3 mr-2" /> Create New Trip
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-accent w-full rounded-md p-2 my-6">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Search by destination..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button className="flex-1 sm:flex-none" onClick={handleSearch}>
              Search
            </Button>
            {isSearchMode && (
              <Button variant="outline" className="flex-1 sm:flex-none" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Trips List */}
      <div>
        <div className="grid gap-6 border-b-2 rounded-md md:p-8">
          {isLoading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading trips...</p>
          ) : myTrips.length > 0 ? (
            
              myTrips.map((trip) => {
                const plan = trip.GeneratedPlan || {};
                const sel = trip.userSelection || {};
                const info = trip.tripDetails || {};

                return (
                  <Card
                    key={trip.id}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                    <div className="p-3 sm:p-6">
                      <div className="flex flex-col gap-6">

                        {/* ── Title + Destination ── */}
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            ✈️
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                              {info.title || sel.title || "Untitled Trip"}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="font-medium truncate">
                                {plan.destination || sel.destination || "Unknown Destination"}
                              </span>
                            </div>
                            {info.source && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                From: {info.source}
                              </p>
                            )}
                          </div>

                          {/* Budget category badge — top right */}
                          {plan.budget_category && (
                            <span className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                              {plan.budget_category}
                            </span>
                          )}
                        </div>

                        {/* ── Stats grid ── */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 w-full">

                          {/* Saved date */}
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Saved</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {toDate(trip.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* Budget */}
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {plan.total_estimated_cost ||
                                  `${getCurrencySymbol(sel.currency || trip.currency)}${sel.budget || 0}`}
                              </p>
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {plan.duration || `${sel.days || 0} days`}
                              </p>
                            </div>
                          </div>

                          {/* Travel type */}
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-base">🧳</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {plan.travel_type || info.category || sel.category || "—"}
                              </p>
                            </div>
                          </div>

                        </div>

                        {/* ── Interests tags ── */}
                        {(info.interests || sel.interests)?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {(info.interests || sel.interests).slice(0, 4).map((interest) => (
                              <span
                                key={interest}
                                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                              >
                                {interest}
                              </span>
                            ))}
                            {(info.interests || sel.interests).length > 4 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                +{(info.interests || sel.interests).length - 4} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* ── Persons + Start date row ── */}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                          <span>
                            👤 {sel.persons || 1} {sel.persons === 1 ? "person" : "persons"}
                          </span>
                          {sel.startDate && (
                            <span>📅 Starts {sel.startDate}</span>
                          )}
                        </div>

                        {/* ── View Details button ── */}
                        <Link
                          href={`/trips/${trip.id}`}
                          className="px-6 py-3 w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                          View Details
                        </Link>

                      </div>
                    </div>
                  </Card>
                );
              })
            
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No trips found</p>
          )}
        </div>

        {/* Pagination controls — hidden in search mode */}
        {!isSearchMode && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages || myTrips.length < PAGE_SIZE || isLoading}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}