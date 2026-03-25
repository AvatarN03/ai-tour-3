import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/config/firebase";

/**
 * Signs in with Google popup.
 * - Returns { success, isNewUser } on success
 * - Creates a Firestore user doc if the account is brand new
 */
export const googleLoginAction = async () => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: true, isNewUser: false };
    }

    // New user → create Firestore document
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || "NA",
      avatarUrl: user.photoURL || "",
      preferences: [],
      tripCount: 0,
      subscription: "free",
      createdAt: new Date(),
    });

    return { success: true, isNewUser: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
