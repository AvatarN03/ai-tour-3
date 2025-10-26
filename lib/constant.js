import {
  Home,
  Map,
  Bookmark,
  MessageSquare,
  Users,
  Wrench,
  BarChart,
  Plane,
  Save,
  Bot,
  Compass,
  Sparkles,
  Calendar,
  Clock,
  DollarSign,
  Repeat,
  Phone,
  Brain,
} from "lucide-react";

export const sidebarMenus = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  // { name: "Discover", href: "/discover", icon: Map },
  { name: "Saved Trips", href: "/saved", icon: Bookmark },
  { name: "AI Assistant", href: "/ai", icon: MessageSquare },
  { name: "Zone", href: "/zone", icon: Users },
  { name: "Tools", href: "/tools", icon: Wrench },
  // { name: "Insights", href: "/insights", icon: BarChart },
];

export const landingPageMenus = [
  {
    name: "Home",
    href: "#home",
  },
  {
    name: "Services",
    href: "#services",
  },
  {
    name: "How It Works",
    href: "#htw",
  },
  {
    name: "About Us",
    href: "#about",
  },
];

export const categories = [
  "City Break",
  "Beach",
  "Mountain",
  "Adventure",
  "Cultural",
  "Relaxation",
  "Business",
  "Family",
  "Romantic",
  "Solo Travel",
];

export const interests = [
  "History & Culture",
  "Nature & Outdoors",
  "Food & Dining",
  "Nightlife",
  "Shopping",
  "Art & Museums",
  "Adventure Sports",
  "Photography",
  "Beaches",
  "Mountains",
  "Architecture",
  "Music & Festivals",
  "Wellness & Spa",
];

export const initialForm = {
  title: "",
  description: "",
  destination: "",
  source:"",
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

export const availablePreferences = [
  "Technology",
  "Design",
  "Business",
  "Health",
  "Entertainment",
  "Sports",
  "Travel",
  "Food",
  "Fashion",
  "Education",
  "Science",
  "Art",
];

export const recommendedTrips = [
  {
    id: 1,
    title: "Weekend in Paris",
    destination: "Paris, France",
    duration: "3 days",
    budget: "$800",
    image: "🗼",
  },
  {
    id: 2,
    title: "Beach Getaway",
    destination: "Bali, Indonesia",
    duration: "7 days",
    budget: "$1200",
    image: "🏖️",
  },
  {
    id: 3,
    title: "Mountain Adventure",
    destination: "Swiss Alps",
    duration: "5 days",
    budget: "$1500",
    image: "🏔️",
  },
];

export const dashboardQuickstarts = [
  {
    icon: Plane,
    title: "Plan Trip",
    description: "Create a new itinerary with AI assistance",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    link: "/saved/create-trip",
  },
  {
    icon: Save,
    title: "Saved Trips",
    description: "View and manage your saved itineraries",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
    link: "/saved",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Get personalized travel recommendations",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    link: "/ai",
  },
];

// Get preference colors
export const preferenceColors = {
  Health: "from-green-500 to-emerald-500",
  Food: "from-orange-500 to-red-500",
  Sports: "from-blue-500 to-cyan-500",
  Travel: "from-purple-500 to-pink-500",
  Adventure: "from-yellow-500 to-orange-500",
  Culture: "from-indigo-500 to-purple-500",
  Nature: "from-green-600 to-teal-500",
  Shopping: "from-pink-500 to-rose-500",
};

export const planSteps = [
  {
    step: "01",
    title: "Tell Us Your Dreams",
    description: "Share your destination, budget, interests, and travel dates",
    icon: Compass,
  },
  {
    step: "02",
    title: "AI Creates Magic",
    description:
      "Our AI analyzes millions of data points to craft your perfect itinerary",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Book & Enjoy",
    description: "Review, customize, and book your personalized travel plan",
    icon: Calendar,
  },
];

export const services = [
  {
    icon: Sparkles,
    title: "AI-Powered Planning",
    description:
      "Get personalized trip recommendations based on your preferences and budget",
    color: "blue",
  },
  {
    icon: Map,
    title: "Smart Discovery",
    description:
      "Explore destinations with interactive maps and local insights",
    color: "green",
  },
  {
    icon: Clock,
    title: "Save Time",
    description:
      "Optimize your itinerary automatically with intelligent scheduling",
    color: "purple",
  },
  {
    icon: DollarSign,
    title: "Budget Tracking",
    description: "Track expenses and find the best deals in real-time",
    color: "red",
  },
];

export const teamMembers = [
  {
    name: "Prashanth Naidu",
    image:
      "./naidu.jpg",
    linkedin: "#",
    github: "#",
    email: "jsprashanth003@gmail.com",
  },
  {
    name: "Prathamesh Bhosale",
    image:
      "./Bhosale.png",
    linkedin: "#",
    github: "#",
    email: "bhosale@example.com",
  },
  {
    name: "Harshad Shinde",
    image:
      "./shinde.jpeg",
    linkedin: "#",
    github: "#",
    email: "shinde@example.com",
  },
  {
    name: "Mohanish Patil",
    image:
      "./patil.jpeg",
    linkedin: "#",
    github: "#",
    email: "mohanish@example.com",
  },
];


export const emergencyContacts = {
  'USA': [
    { name: 'Police', number: '911', type: 'Emergency' },
    { name: 'Fire Department', number: '911', type: 'Emergency' },
    { name: 'Ambulance', number: '911', type: 'Medical' },
    { name: 'US Embassy', number: '+1-202-501-4444', type: 'Government' }
  ],
  'UK': [
    { name: 'Police', number: '999', type: 'Emergency' },
    { name: 'Fire Department', number: '999', type: 'Emergency' },
    { name: 'Ambulance', number: '999', type: 'Medical' },
    { name: 'UK Embassy', number: '+44-20-7008-5000', type: 'Government' }
  ],
  'India': [
    { name: 'Police', number: '100', type: 'Emergency' },
    { name: 'Fire Department', number: '101', type: 'Emergency' },
    { name: 'Ambulance', number: '102', type: 'Medical' },
    { name: 'Women Helpline', number: '1091', type: 'Emergency' },
    { name: 'Indian Embassy', number: '+91-11-2419-8000', type: 'Government' }
  ],
  'Japan': [
    { name: 'Police', number: '110', type: 'Emergency' },
    { name: 'Fire Department', number: '119', type: 'Emergency' },
    { name: 'Ambulance', number: '119', type: 'Medical' },
    { name: 'Japan Travel Help', number: '050-3816-2787', type: 'Tourist' }
  ],
  'Australia': [
    { name: 'Police', number: '000', type: 'Emergency' },
    { name: 'Fire Department', number: '000', type: 'Emergency' },
    { name: 'Ambulance', number: '000', type: 'Medical' },
    { name: 'Australian Embassy', number: '+61-2-6261-3305', type: 'Government' }
  ],
  'Canada': [
    { name: 'Police', number: '911', type: 'Emergency' },
    { name: 'Fire Department', number: '911', type: 'Emergency' },
    { name: 'Ambulance', number: '911', type: 'Medical' },
    { name: 'Canadian Embassy', number: '+1-613-996-8885', type: 'Government' }
  ],
  'Germany': [
    { name: 'Police', number: '110', type: 'Emergency' },
    { name: 'Fire Department', number: '112', type: 'Emergency' },
    { name: 'Ambulance', number: '112', type: 'Medical' },
    { name: 'German Embassy', number: '+49-30-5000-0', type: 'Government' }
  ],
  'France': [
    { name: 'Police', number: '17', type: 'Emergency' },
    { name: 'Fire Department', number: '18', type: 'Emergency' },
    { name: 'Ambulance', number: '15', type: 'Medical' },
    { name: 'French Embassy', number: '+33-1-43-17-67-00', type: 'Government' }
  ],
  'Spain': [
    { name: 'Police', number: '091', type: 'Emergency' },
    { name: 'Fire Department', number: '080', type: 'Emergency' },
    { name: 'Ambulance', number: '061', type: 'Medical' },
    { name: 'Spanish Embassy', number: '+34-91-379-1700', type: 'Government' }
  ],
  'Italy': [
    { name: 'Police', number: '113', type: 'Emergency' },
    { name: 'Fire Department', number: '115', type: 'Emergency' },
    { name: 'Ambulance', number: '118', type: 'Medical' },
    { name: 'Italian Embassy', number: '+39-06-4941-1', type: 'Government' }
  ],
  'China': [
    { name: 'Police', number: '110', type: 'Emergency' },
    { name: 'Fire Department', number: '119', type: 'Emergency' },
    { name: 'Ambulance', number: '120', type: 'Medical' },
    { name: 'Traffic Accident', number: '122', type: 'Emergency' }
  ],
  'Brazil': [
    { name: 'Police', number: '190', type: 'Emergency' },
    { name: 'Fire Department', number: '193', type: 'Emergency' },
    { name: 'Ambulance', number: '192', type: 'Medical' },
    { name: 'Brazilian Embassy', number: '+55-61-2030-8000', type: 'Government' }
  ],
  'Mexico': [
    { name: 'Police', number: '911', type: 'Emergency' },
    { name: 'Fire Department', number: '911', type: 'Emergency' },
    { name: 'Ambulance', number: '911', type: 'Medical' },
    { name: 'Tourist Assistance', number: '078', type: 'Tourist' }
  ],
  'South Korea': [
    { name: 'Police', number: '112', type: 'Emergency' },
    { name: 'Fire Department', number: '119', type: 'Emergency' },
    { name: 'Ambulance', number: '119', type: 'Medical' },
    { name: 'Tourist Hotline', number: '1330', type: 'Tourist' }
  ],
  'Russia': [
    { name: 'Police', number: '102', type: 'Emergency' },
    { name: 'Fire Department', number: '101', type: 'Emergency' },
    { name: 'Ambulance', number: '103', type: 'Medical' },
    { name: 'Universal Emergency', number: '112', type: 'Emergency' }
  ],
  'Netherlands': [
    { name: 'Police', number: '112', type: 'Emergency' },
    { name: 'Fire Department', number: '112', type: 'Emergency' },
    { name: 'Ambulance', number: '112', type: 'Medical' },
    { name: 'Dutch Embassy', number: '+31-70-348-6486', type: 'Government' }
  ],
  'Switzerland': [
    { name: 'Police', number: '117', type: 'Emergency' },
    { name: 'Fire Department', number: '118', type: 'Emergency' },
    { name: 'Ambulance', number: '144', type: 'Medical' },
    { name: 'Universal Emergency', number: '112', type: 'Emergency' }
  ],
  'Sweden': [
    { name: 'Police', number: '112', type: 'Emergency' },
    { name: 'Fire Department', number: '112', type: 'Emergency' },
    { name: 'Ambulance', number: '112', type: 'Medical' },
    { name: 'Swedish Embassy', number: '+46-8-405-1000', type: 'Government' }
  ],
  'UAE': [
    { name: 'Police', number: '999', type: 'Emergency' },
    { name: 'Fire Department', number: '997', type: 'Emergency' },
    { name: 'Ambulance', number: '998', type: 'Medical' },
    { name: 'Tourist Police', number: '901', type: 'Tourist' }
  ],
  'Singapore': [
    { name: 'Police', number: '999', type: 'Emergency' },
    { name: 'Fire Department', number: '995', type: 'Emergency' },
    { name: 'Ambulance', number: '995', type: 'Medical' },
    { name: 'Non-Emergency', number: '1800-255-0000', type: 'Emergency' }
  ],
  'New Zealand': [
    { name: 'Police', number: '111', type: 'Emergency' },
    { name: 'Fire Department', number: '111', type: 'Emergency' },
    { name: 'Ambulance', number: '111', type: 'Medical' },
    { name: 'NZ Embassy', number: '+64-4-439-8000', type: 'Government' }
  ],
  'Thailand': [
    { name: 'Police', number: '191', type: 'Emergency' },
    { name: 'Fire Department', number: '199', type: 'Emergency' },
    { name: 'Ambulance', number: '1669', type: 'Medical' },
    { name: 'Tourist Police', number: '1155', type: 'Tourist' }
  ],
  'South Africa': [
    { name: 'Police', number: '10111', type: 'Emergency' },
    { name: 'Fire Department', number: '10177', type: 'Emergency' },
    { name: 'Ambulance', number: '10177', type: 'Medical' },
    { name: 'SA Embassy', number: '+27-12-421-1000', type: 'Government' }
  ],
  'Turkey': [
    { name: 'Police', number: '155', type: 'Emergency' },
    { name: 'Fire Department', number: '110', type: 'Emergency' },
    { name: 'Ambulance', number: '112', type: 'Medical' },
    { name: 'Turkish Embassy', number: '+90-312-455-5555', type: 'Government' }
  ],
  'Poland': [
    { name: 'Police', number: '997', type: 'Emergency' },
    { name: 'Fire Department', number: '998', type: 'Emergency' },
    { name: 'Ambulance', number: '999', type: 'Medical' },
    { name: 'Universal Emergency', number: '112', type: 'Emergency' }
  ]
};

export const TABS = [
  { id: "expense", label: "Expense Tracker", icon: DollarSign, activeColor: "blue" },
  { id: "currency", label: "Currency Converter", icon: Repeat, activeColor: "blue" },
  { id: "emergency", label: "Emergency Contacts", icon: Phone, activeColor: "blue" },
  { id: "ai", label: "AI Assistant", icon: Brain, activeColor: "purple" },
];