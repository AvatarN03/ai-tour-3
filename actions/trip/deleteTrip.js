import { deleteDoc, doc, increment, updateDoc } from "firebase/firestore";

import { db } from "@/lib/config/firebase";
import { logActivity } from "@/lib/services/firestore";

export const deleteTripAction = async ({ profile, tripId, plan }) => {
  try {
    await updateDoc(doc(db, "users", profile.uid), {
      tripCount: increment(-1),
    });

    await deleteDoc(doc(db, "users", profile.uid, "trips", tripId));

    await logActivity({
      userId: profile?.uid,
      action: "DELETE",
      entity: "TRIP",
      entityId: tripId,
      metadata: { tripName: plan?.tripDetails?.title || "Untitled Trip" },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};