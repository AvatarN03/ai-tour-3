"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Map,
  Clock,
  TrendingUp,
  Globe,
  Compass,
  Calendar,
  DollarSign,
} from "lucide-react";
import Navbar from "@/components/custom/Navbar";
import { planSteps, services } from "@/lib/constant";
import AboutSection from "@/components/custom/AboutSection";
import Link from "next/link";

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-200 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-10  md:py-32 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-400 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          className="absolute z-0 inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.3),transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.2),transparent_40%)]"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute z-0 inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.2),transparent_40%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.15),transparent_40%)]"
        />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="inline-flex  items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 mb-6 border border-blue-200 dark:border-purple-700/50"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                AI-Powered Travel Planning
              </span>
            </motion.div>
            <motion.div
              animate={{ y: [20, 60, 20] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute hidden md:block left-10 -top-10 rounded-full p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xl"
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-100"
                style={{
                  backgroundSize: "200% 200%",
                }}
              />
              <p className="relative z-10 bg-white dark:bg-gray-800 backdrop-blur-md rounded-full p-2">
                AI Assistant to Plan your Trips
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 "
            >
              Plan Your Dream Trip
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent relative">
                with AI Intelligence
                <div className="absolute -bottom-1 right-0 hidden md:block w-[75%] h-1  bg-pink-400 rounded-xl animate-collapsible-up" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto my-4"
            >
              Discover amazing destinations, create personalized itineraries,
              and get AI-powered recommendations for your next adventure. Smart
              travel planning made simple.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href={"/auth?continueTo=/dashboard"}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl font-semibold transition-all transform  shadow-lg hover:shadow-2xl hover:shadow-fuchsia-500/50 cursor-pointer"
              >
                Get Started
              </Link>
              <Link
                href={"/auth?continueTo=/discover"}
                className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-violet-600 dark:hover:border-violet-500 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Explore Destinations
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Cards Animation */}
          <div className="relative mt-20 h-64 hidden md:block">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-10 top-0 w-64 h-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Map className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Paris, France
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                5-day romantic getaway with AI-curated experiences
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute right-10 top-10 w-64 h-40 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 dark:from-violet-600 dark:via-fuchsia-600 dark:to-pink-600 rounded-2xl shadow-2xl shadow-fuchsia-500/30 p-6 text-white border border-white/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="font-semibold">Tokyo, Japan</span>
              </div>
              <p className="text-sm opacity-90">
                7-day adventure with local insights
              </p>
            </motion.div>
          </div>
          <div>
            <video
              autoPlay
              loop
              muted
              className="w-full mt-4 md:-mt-44 max-w-3xl mx-auto rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <source src="landing-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 px-6  bg-slate-300 dark:bg-gray-900"
        id="services"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Why Choose AI Tour?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-base md:text-xl text-gray-600 dark:text-gray-300"
            >
              Everything you need for the perfect trip, powered by AI
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div
                  className={`w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl flex items-center justify-center mb-6`}
                >
                  <feature.icon
                    className={`w-8 h-8 text-${feature.color}-600 dark:text-${feature.color}-400`}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6" id="htw">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Plan Your Trip in 3 Easy Steps
            </h2>
            <p className="text-base tracking-widest text-gray-600 dark:text-gray-300">
              From inspiration to itinerary in minutes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 ">
            {planSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="text-7xl font-bold text-blue-400 dark:text-gray-700 mb-4">
                  {item.step}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg h-[70%] transition duration-300 ease-in-out group-hover:-translate-y-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-12 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-20 px-6 bg-slate-300 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-4 md:p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-2xl md:text-5xl font-bold mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-base md:text-xl mb-8 opacity-90">
            Join thousands of travelers who trust AI Tour for their perfect
            vacation
          </p>
          <Link
            href={"/auth?continueTo=/saved/create-trip"}
            className="px-4 whitespace-nowrap md:px-10 py-4 bg-gray-300 text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-102 inline-block shadow-lg cursor-pointer"
          >
            Start Planning Now →
          </Link>
        </motion.div>
      </section>

      <section id="about" className="px-10 py-4 w-full">
        <AboutSection />
      </section>

      <footer className="w-full text-xl text-center bg-gray-900 px-10 pt-6 pb-3 flex items-center justify-center ">
        <small className="text-gray-300 tracking-widest">
          &copy;{" "}
          <span className="gradient-text ">{new Date().getFullYear()}</span> AI
          Tour. All rights reserved.
        </small>
      </footer>
    </div>
  );
};

export default LandingPage;
