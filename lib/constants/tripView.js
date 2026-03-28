// Trip View Constants and Helper Functions

// Icon and label mappings for sections
export const SECTION_HEADERS = {
  accommodation: {
    icon: 'Hotel',
    title: 'Accommodation Options',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  itinerary: {
    icon: 'Navigation',
    title: 'Day-by-Day Itinerary',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  budget: {
    icon: 'DollarSign',
    title: 'Budget Breakdown',
    bgColor: 'bg-amber-100 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  cuisine: {
    icon: 'Utensils',
    title: 'Local Cuisine',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  safety: {
    icon: 'Shield',
    title: 'Safety Tips',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  packing: {
    icon: 'Briefcase',
    title: 'Packing Suggestions',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
};

// Currency symbols mapping
export const CURRENCY_SYMBOLS = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  JPY: '¥',
};

// Helper function to build hero stats
export const buildHeroStats = (plan, currency, sym) => [
  {
    icon: 'MapPin',
    iconSize: 16,
    label: 'Destination',
    value: plan?.destination,
    span: 'col-span-full md:col-span-2',
  },
  {
    icon: 'Navigation',
    iconSize: 16,
    label: 'Source',
    value: plan?.tripDetails?.source || plan?.source,
    span: 'col-span-full md:col-span-2',
  },
  {
    icon: 'Users',
    iconSize: 16,
    label: 'Travel Type',
    value: plan?.travel_type,
  },
  {
    icon: 'Tag',
    iconSize: 16,
    label: 'Category',
    value: plan?.tripDetails?.category || plan?.category,
  },
  {
    icon: 'Calendar',
    iconSize: 16,
    label: 'Duration',
    value: plan?.duration,
  },
  {
    icon: 'DollarSign',
    iconSize: 16,
    label: `Budget (${currency})`,
    value: `${sym} ${plan?.total_estimated_cost}`,
  },
];
