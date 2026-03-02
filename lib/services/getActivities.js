import { 
  collection, 
  query, 
  where, 
  limit, 
  getDocs 
} from "firebase/firestore";
import { db } from "../config/firebase";

export async function getRecentActivities(userId) {
  try {
    const q = query(
      collection(db, "activities"),
      where("userId", "==", userId), // filter in DB
      limit(10)                      // only 10 docs from DB
    );

    const snapshot = await getDocs(q);

    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort locally (only 10 docs → very cheap)
    activities.sort((a, b) => {
      return b.createdAt?.seconds - a.createdAt?.seconds;
    });

    return activities;

  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}