"use client";
import LocationInput from "address-autocomplete-react/dist/LocationInput";
import React from "react";

const LocationComplete = ({ name, value, onChange, placeholder, error }) => {
  const handleLocationSelect = (location) => {
    // Mimic a native input event so handleInputChange works as-is
    onChange({
      target: {
        name,
        value: location.display_name || location.label || "",
      },
    });
  };

  return (
    <div className="relative">
      <LocationInput
        placeholder={placeholder || "Search location..."}
        onLocationSelect={handleLocationSelect}
        defaultValue={value}
        className={`w-full px-4 py-3 border-2 rounded-xl bg-slate-300 dark:bg-gray-800! 
          text-gray-900! dark:text-white! transition-all focus:ring-2 focus:ring-blue-500 
          ${error
            ? "border-red-500"
            : "border-gray-200 dark:border-gray-700"
          }`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default LocationComplete;