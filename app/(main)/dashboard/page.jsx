"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plane,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import TripRecommendations from "@/components/features/dashboard/Recommendation";
import RecentActivity from "@/components/features/dashboard/RecentActivity";

import LocationAccess from "@/hooks/LocationAccess";

import { dashboardQuickstarts } from "@/lib/constants";

import { useAuth } from "@/context/useAuth";

export default function DashboardPage() {
  const { profile, user } = useAuth();

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-5 md:p-10">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                AI-Powered Dashboard
              </span>
            </div>

            <h1 className="text-2xl md:text-5xl font-bold text-white mb-3">
              Welcome back, Traveler!
            </h1>

            <p className="text-white/90 text-base md:text-lg">
              Ready to plan your next adventure? Let's make it unforgettable.
            </p>
          </div>

          <Link href="/trips/create-trip">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-white whitespace-nowrap text-purple-600 hover:bg-gray-100 font-semibold px-4 md:px-8 py-6 text-base md:text-lg shadow-xl">
                <Plane className="w-5 h-5 mr-2" />
                Create New Trip
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Weather */}
      <LocationAccess />

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-3 gap-6 p-2">
          {dashboardQuickstarts.map((action, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden p-6 text-center hover:shadow-2xl transition-all duration-300 border-2 border-transparent bg-white dark:bg-gray-800"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0`}
              />

              <motion.div
                whileHover={{ scale: 1.1, rotate: 6 }}
                className={`relative w-20 h-20 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg z-10`}
              >
                <action.icon className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {action.description}
              </p>

              <Link
                href={action.link}
                className="relative z-10 group-hover:-translate-y-2.5 duration-200 ease-out"
              >
                <Button
                  className={`w-full bg-gradient-to-r ${action.gradient} text-white font-semibold hover:brightness-110 transition-all hover:text-base`}
                >
                  Get Started
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <TripRecommendations />

      {/* Recent Activity */}
      <div>
        <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Your latest actions and updates
              </p>
            </div>
          </div>

          <RecentActivity userId={profile?.uid || user.userId} />
        </div>
      </div>
    </div>
  );
}