import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

import { db } from "../config/firebase";

export async function getRecentActivities(userId) {
  try {
    if (!userId) return [];

    const q = query(
      collection(db, "users", userId, "activities"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}