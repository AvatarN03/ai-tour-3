import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

export const savePreferencesAction = async ({ userId, username, preferences }) => {
  try {
    const batch = writeBatch(db);
    batch.set(
      doc(db, "users", userId),
      { username: username.trim(), preferences, updatedAt: serverTimestamp() },
      { merge: true }
    );
    batch.set(doc(db, "usernames", username.trim()), { uid: userId });
    await batch.commit();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
