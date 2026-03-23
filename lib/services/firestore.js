/**
 * Firestore Services
 * Combines: getActivities.js + logActivity.js (DB operations only)
 * UI helpers (icons, colors, format) live in services/activity.js
 */

import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/config/firebase";

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getRecentActivities(userId) {
  try {
    if (!userId) return [];

    const q = query(
      collection(db, "users", userId, "activities"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export async function logActivity({ userId, action, entity, entityId, metadata }) {
  try {
    if (!userId) return;

    await addDoc(collection(db, "users", userId, "activities"), {
      action,
      entity,
      entityId,
      metadata,
      createdAt: serverTimestamp(),
    });

    // Keep a simple count on the user document for quick stats
    await updateDoc(doc(db, "users", userId), {
      activityCount: increment(1),
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }
}