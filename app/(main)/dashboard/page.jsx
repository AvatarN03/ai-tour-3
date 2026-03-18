"use client";

import Link from "next/link";

import { useTranslation } from "react-i18next";
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

import { dashboardQuickstarts } from "@/lib/utils/constant";

import { useAuth } from "@/providers/useAuth";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { profile, user } = useAuth();

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header with Enhanced Design */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-5 md:p-10">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{t('dashboard.badge')}</span>
            </div>
            <h1 className="text-2xl md:text-5xl font-bold text-white mb-3">
              {t('dashboard.welcomeTitle')}
            </h1>
            <p className="text-white/90 text-base md:text-lg">
              {t('dashboard.welcomeDesc')}
            </p>
          </div>
          <Link href="/trips/create-trip">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-white whitespace-nowrap text-purple-600 hover:bg-gray-100 font-semibold px-4 md:px-8 py-6 text-base md:text-lg shadow-xl">
                <Plane className="w-5 h-5 mr-2" />
                {t('dashboard.createTrip')}
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Weather Widget */}
      <div>
        <LocationAccess />
      </div>

      {/* Quick Actions with Enhanced Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6 p-2">
          {dashboardQuickstarts.map((action, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden p-6 text-center hover:shadow-2xl transition-all duration-300 border-2 border-transparent bg-white dark:bg-gray-800"
            >
              {/* Background Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0`}
              ></div>

              {/* Icon Box */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 6 }}
                className={`relative w-20 h-20 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg z-10`}
              >
                <action.icon className="w-10 h-10 text-white" />
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t(action.titleKey)}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t(action.descriptionKey)}
              </p>

              <Link href={action.link} className="relative z-10 group-hover:-translate-y-2.5 duration-200 ease-out">
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

      {/* Recommended Trips */}
      <div>
        <TripRecommendations />
        {/* <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Recommended for You
          </h2>
          <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            View All
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {recommendedTrips.map((trip) => (
            <motion.div
              key={trip.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
               
                <div
                  className={`relative h-40 bg-gradient-to-br ${trip.gradient} flex items-center justify-center`}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-7xl filter drop-shadow-lg">
                      {trip.image}
                    </span>
                  </motion.div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Popular
                  </div>
                </div>

               
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {trip.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>{trip.destination}</span>
                  </div>

                  <div className="flex items-center justify-between mb-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span>{trip.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                      <DollarSign className="w-4 h-4" />
                      <span>{trip.budget}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-500 dark:group-hover:to-purple-500 transition-all">
                    View Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div> */}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col gap-1">

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('dashboard.activity.recentActivityTitle')}
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