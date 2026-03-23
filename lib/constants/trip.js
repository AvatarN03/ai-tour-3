

export const categories = [
  { label: "City Break" },
  { label: "Beach" },
  { label: "Mountain" },
  { label: "Adventure" },
  { label: "Cultural" },
  { label: "Relaxation" },
  { label: "Business" },
  { label: "Family" },
  { label: "Romantic" },
  { label: "Solo Travel" },
];

export const interests = [
  { label: "History & Culture" },
  { label: "Nature & Outdoors" },
  { label: "Food & Dining" },
  { label: "Nightlife" },
  { label: "Shopping" },
  { label: "Art & Museums" },
  { label: "Adventure Sports" },
  { label: "Photography" },
  { label: "Beaches" },
  { label: "Mountains" },
  { label: "Architecture" },
  { label: "Music & Festivals" },
  { label: "Wellness & Spa" },
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
