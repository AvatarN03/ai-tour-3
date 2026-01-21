import { usePlacesAutocomplete } from 'places-autocomplete-hook';
import React, { useState } from 'react';

const AutoCompletion = ({ onPlaceSelect }) => {
  const {
    value,
    suggestions,
    setValue,
    clearSuggestions,
    loading,
    error,
    getPlaceDetails,
    handlePlaceSelect,
  } = usePlacesAutocomplete({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY,
    debounce: 300, // debounce for API calls
  });

  const handleSelect = async (placeId) => {
    await handlePlaceSelect(placeId);
    const details = await getPlaceDetails(placeId);
    clearSuggestions();
    setValue(details.formattedAddress, false);
    onPlaceSelect?.(details); // Pass the selected place to parent
    console.log('Selected place:', details);
  };

  return (
    <div className="relative">
      <input
        className="w-full p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a destination"
      />
      {loading && (
        <div className="absolute top-full left-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 shadow-md">
          Loading...
        </div>
      )}
      {error && (
        <div className="absolute top-full left-0 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2">
          {error.message}
        </div>
      )}
      {suggestions.status === 'OK' && suggestions.data.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md rounded-md max-h-60 overflow-auto z-50">
          {suggestions.data.map((prediction) => (
            <li
              key={prediction.placeId}
              className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleSelect(prediction.placeId)}
            >
              {prediction.structuredFormat?.mainText?.text},{' '}
              {prediction.structuredFormat?.secondaryText?.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompletion;
