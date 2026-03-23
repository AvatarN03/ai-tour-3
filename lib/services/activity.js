/**
 * Activity UI Helpers
 * Merged: formatActivity.js + icon/color helpers (previously in logActivity.js)
 */

import { ActivityIcon, Edit, FileText, MapPin, Plus, Trash2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Format
// ---------------------------------------------------------------------------

export function formatActivity(activity) {
  if (activity.entity === "TRIP") {
    switch (activity.action) {
      case "CREATE":
        return "Created a new trip";
      case "UPDATE":
        return "Updated a trip";
      case "DELETE":
        return "Deleted a trip";
      default:
        return "Trip activity";
    }
  }
  return `${activity.action} ${activity.entity}`;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

export function getActivityIcon(action, entity) {
  if (action === "CREATE") return Plus;
  if (action === "UPDATE") return Edit;
  if (action === "DELETE") return Trash2;
  if (entity === "TRIP") return MapPin;
  if (entity === "DOCUMENT") return FileText;
  return ActivityIcon;
}

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export function getActivityColor(action) {
  switch (action) {
    case "CREATE":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
    case "UPDATE":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case "DELETE":
      return "bg-red-500/10 text-red-600 border-red-200";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200";
  }
}