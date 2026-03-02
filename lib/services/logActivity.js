import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { ActivityIcon, Edit, FileText, MapPin, Plus, Trash2 } from "lucide-react";

export async function logActivity({
  userId,
  action,
  entity,
  entityId,
  metadata,
}) {
  try {
    await addDoc(collection(db, "activities"), {
      userId,
      action,
      entity,
      entityId,
      metadata,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }
}

// Icon mapping for different actions and entities
export const getActivityIcon = (action, entity) => {
  if (action === "CREATE") return Plus;
  if (action === "UPDATE") return Edit;
  if (action === "DELETE") return Trash2;
  if (entity === "TRIP") return MapPin;
  if (entity === "DOCUMENT") return FileText;
  return ActivityIcon;
};

// Color scheme for different actions
export const getActivityColor = (action) => {
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
};
