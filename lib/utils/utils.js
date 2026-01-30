import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  Building2,
  PalmTree,
  Mountain,
  Compass,
  Landmark,
  Lotus,
  Briefcase,
  Users,
  Heart,
  Backpack,
  Sparkles
} from "lucide-react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return "N/A";
};





// export const getTripCategoryIcon = (category) => {
//   switch (category) {
//     case "City Break":
//       return Building2;

//     case "Beach":
//       return Waves; // Better than PalmTree for beach category

//     case "Mountain":
//       return Mountain;

//     case "Adventure":
//       return Compass;

//     case "Cultural":
//       return Landmark;

//     case "Relaxation":
//       return Sparkles; // More appropriate than Lotus (which doesn't exist in lucide-react)

//     case "Business":
//       return Briefcase;

//     case "Family":
//       return Users;

//     case "Romantic":
//       return Heart;

//     case "Solo Travel":
//       return Backpack;

//     default:
//       return Map; // More travel-related than Sparkles for default
//   }
// };

export const getTripCategoryEmoji = (category) => {
  switch (category) {
    case "City Break":
      return "🏙️";

    case "Beach":
      return "🏖️";

    case "Mountain":
      return "🏔️";

    case "Adventure":
      return "🧭";

    case "Cultural":
      return "🏛️";

    case "Relaxation":
      return "🧘‍♂️";

    case "Business":
      return "💼";

    case "Family":
      return "👨‍👩‍👧‍👦";

    case "Romantic":
      return "❤️";

    case "Solo Travel":
      return "🎒";

    default:
      return "🗺️";
  }
};
