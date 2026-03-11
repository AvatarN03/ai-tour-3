import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


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
