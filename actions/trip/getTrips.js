import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

import { db } from "@/lib/config/firebase";

export const getTripsAction = async ({
  userId,
  pageSize,
  cursor,
  searchQuery,
}) => {
  try {
    const tripsRef = collection(db, "users", userId, "trips");

    // 🔍 SEARCH MODE
    if (searchQuery?.trim()) {
      const term = searchQuery.trim();

      const q = query(
        tripsRef,
        where("userSelection.destination", ">=", term),
        where("userSelection.destination", "<=", term + "\uf8ff"),
        limit(pageSize)
      );

      const snapshot = await getDocs(q);

      return {
        success: true,
        data: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        lastDoc: null,
      };
    }

    // 📄 PAGINATION MODE
    const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];

    if (cursor) constraints.push(startAfter(cursor));

    const q = query(tripsRef, ...constraints);
    const snapshot = await getDocs(q);

    const trips = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      data: trips,
      lastDoc:
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};