import { doc, increment, setDoc, updateDoc } from "firebase/firestore";

import { db } from "@/lib/config/firebase";
import { generateTravelPlan } from "@/actions/trip/ai";
import { logActivity } from "@/lib/services/logActivity";

export const createTripAction = async ({ formData, profile }) => {
  try {
    const tripData = {
      ...formData,
      budget: parseFloat(formData.budget || 0),
      days: parseInt(formData.days || 0, 10),
      persons: parseInt(formData.persons || 1, 10),
      currency: formData.currency || "INR",
    };

    // 🔥 AI CALL
    const aiGeneratedPlan = await generateTravelPlan(tripData);

    // 🔥 SAVE TRIP
    const docId = Date.now().toString();

    await setDoc(doc(db, "users", profile.uid, "trips", docId), {
      id: docId,
      userId: profile.uid,
      userSelection: tripData,
      GeneratedPlan: aiGeneratedPlan,
      createdAt: new Date(),
      updatedAt: new Date(),
      currency: tripData.currency,
    });

    // 🔥 UPDATE COUNT
    await updateDoc(doc(db, "users", profile.uid), {
      tripCount: increment(1),
    });

    // 🔥 LOG
    await logActivity({
      userId: profile.uid,
      action: "CREATE",
      entity: "TRIP",
      entityId: docId,
      metadata: { tripName: tripData.title },
    });

    return { success: true, docId };

  } catch (error) {
    console.error("createTripAction error:", error);
    return { success: false, error };
  }
};