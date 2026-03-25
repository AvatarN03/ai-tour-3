import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

export const getTripAction = async ({ userId, tripId }) => {
  try {
    const docRef = doc(db, "users", userId, "trips", String(tripId));
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Trip not found" };
    }

    return { success: true, data: docSnap.data() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
