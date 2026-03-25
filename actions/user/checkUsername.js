import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

export const checkUsernameAction = async ({ username }) => {
  try {
    const snapshot = await getDoc(doc(db, "usernames", username));
    return { success: true, taken: snapshot.exists() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
