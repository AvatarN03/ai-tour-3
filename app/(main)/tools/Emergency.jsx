"use client"
import React, { useState } from "react";
import {
  Phone,
  Search,
  AlertCircle,
  Globe,
  Heart,
  Shield,
} from "lucide-react";
import { emergencyContacts } from "@/lib/constant";

const getTypeIcon = (type) => {
  switch (type) {
    case "Emergency":
      return <Shield className="w-5 h-5" />;
    case "Medical":
      return <Heart className="w-5 h-5" />;
    case "Government":
      return <Globe className="w-5 h-5" />;
    case "Tourist":
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <Phone className="w-5 h-5" />;
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case "Emergency":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50";
    case "Medical":
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50";
    case "Government":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50";
    case "Tourist":
      return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/50";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  }
};

export default function EmergencyContacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const countries = Object.keys(emergencyContacts).sort();
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayCountries = selectedCountry ? [selectedCountry] : filteredCountries;

  return (
    <div className="rounded-sm md:rounded-xl p-2 md:p-4 bg-gradient-to-br from-slate-200 via-neutral-300 to-slate-400 dark:from-slate-900 dark:via-slate-950 dark:to-black transition-colors duration-500">
      <div>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Emergency Contacts
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
            Quick access to emergency services worldwide
          </p>
        </div>

        {/* Search and Filter */}
        <div className="rounded-xl shadow-lg bg-white dark:bg-slate-800/60 p-3 md:p-6 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 text-gray-700 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white dark:bg-slate-900 dark:text-gray-100"
              />
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-3 border text-gray-700 cursor-pointer border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2  focus:ring-red-500 focus:border-transparent outline-none bg-white dark:bg-slate-900 dark:text-gray-100"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Emergency Contacts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {displayCountries.map((country) => (
            <div
              key={country}
              className="rounded-md shadow-lg overflow-hidden hover:shadow-xl transition-all bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
            >
              <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 dark:from-red-700 dark:to-orange-700">
                <h2 className="text-2xl font-bold text-white">{country}</h2>
              </div>
              <div className="p-2 md:p-4 space-y-3">
                {emergencyContacts[country].map((contact, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-3 sm:flex-row items-start  md:items-center justify-between p-3 rounded-lg border ${getTypeColor(
                      contact.type
                    )} transition-transform hover:scale-[1.03]`}
                  >
                    <div className="flex items-center gap-3">
                      {getTypeIcon(contact.type)}
                      <div>
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-xs opacity-75">{contact.type}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${contact.number}`}
                      className="flex items-center  gap-2 bg-white dark:bg-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      {contact.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No countries found matching your search
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong className="text-red-600 dark:text-red-400">Important:</strong>{" "}
            Always verify emergency numbers when traveling
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            These contacts are for reference. Local emergency services may vary by
            region.
          </p>
        </div>
      </div>
    </div>
  );
}
