/**
 * Trip Constants
 * Categories, interests, initial form state, and create-trip field config
 */

export const categories = [
  { label: "City Break",   translationKey: "categories.cityBreak" },
  { label: "Beach",        translationKey: "categories.beach" },
  { label: "Mountain",     translationKey: "categories.mountain" },
  { label: "Adventure",    translationKey: "categories.adventure" },
  { label: "Cultural",     translationKey: "categories.cultural" },
  { label: "Relaxation",   translationKey: "categories.relaxation" },
  { label: "Business",     translationKey: "categories.business" },
  { label: "Family",       translationKey: "categories.family" },
  { label: "Romantic",     translationKey: "categories.romantic" },
  { label: "Solo Travel",  translationKey: "categories.soloTravel" },
];

export const interests = [
  { label: "History & Culture",  translationKey: "interests.historyCulture" },
  { label: "Nature & Outdoors",  translationKey: "interests.natureOutdoors" },
  { label: "Food & Dining",      translationKey: "interests.foodDining" },
  { label: "Nightlife",          translationKey: "interests.nightlife" },
  { label: "Shopping",           translationKey: "interests.shopping" },
  { label: "Art & Museums",      translationKey: "interests.artMuseums" },
  { label: "Adventure Sports",   translationKey: "interests.adventureSports" },
  { label: "Photography",        translationKey: "interests.photography" },
  { label: "Beaches",            translationKey: "interests.beaches" },
  { label: "Mountains",          translationKey: "interests.mountains" },
  { label: "Architecture",       translationKey: "interests.architecture" },
  { label: "Music & Festivals",  translationKey: "interests.musicFestivals" },
  { label: "Wellness & Spa",     translationKey: "interests.wellnessSpa" },
];

export const initialForm = {
  title: "",
  description: "",
  destination: "",
  source: "",
  category: "",
  currency: "INR",
  budget: "",
  days: "",
  persons: "",
  startDate: "",
  interests: [],
  accommodation: "",
  transportation: "",
  activities: "",
  dietaryRestrictions: "",
  specialRequests: "",
};

/** Field config for the "extra preferences" section of the create-trip form */
export const createTripData = [
  {
    name: "accommodation",
    label: "Accommodation Preferences",
    placeholder: "e.g., Hotel near city center, Airbnb with kitchen, Budget hostel...",
    ring: "focus:ring-teal-500",
  },
  {
    name: "transportation",
    label: "Transportation",
    placeholder: "e.g., Round-trip flight, Train passes, Rental car...",
    ring: "focus:ring-teal-500",
  },
  {
    name: "activities",
    label: "Specific Activities",
    placeholder: "e.g., Visit Eiffel Tower, Wine tasting tour, Cooking class...",
    ring: "focus:ring-teal-500",
  },
  {
    name: "dietaryRestrictions",
    label: "Dietary Restrictions",
    placeholder: "e.g., Vegetarian, Gluten-free, Nut allergy...",
    ring: "focus:ring-pink-500",
  },
  {
    name: "specialRequests",
    label: "Special Requests",
    placeholder: "Any other special requests or notes for your trip...",
    ring: "focus:ring-pink-500",
    rows: 3,
  },
];
