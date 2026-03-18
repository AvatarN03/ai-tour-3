import { clsx } from "clsx";
import { format } from "date-fns";
import { Star } from "lucide-react";
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

export function getMonthKey(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM yyyy')
}

export function getLastMonths(count) {
  const now = new Date()
  const months = []
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(format(d, 'MMM yyyy'))
  }
  return months
}

export // Rating stars helper
const getRatingStars = (rating) => {
  const numRating = parseFloat(rating);
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < Math.floor(numRating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }
        />
      ))}
      <span className="text-sm ml-1 text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {rating}
      </span>
    </div>
  );
};