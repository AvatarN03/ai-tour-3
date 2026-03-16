"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/config/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Loading from "@/components/custom/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser || null);

      if (authUser) {
        try {
          const docRef  = doc(db, "users", authUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Merge Firestore data with live Google auth fields
            setProfile({
              displayName: authUser.displayName,
              email:       authUser.email,
              photoURL:    authUser.photoURL,
              ...docSnap.data(),             // Firestore fields win over defaults
            });
          } else {
            // First Google login — create the base document
            const baseProfile = {
              displayName: authUser.displayName,
              email:       authUser.email,
              photoURL:    authUser.photoURL,
              createdAt:   serverTimestamp(),
            };
            await setDoc(docRef, baseProfile);
            setProfile(baseProfile);
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          // Fallback: at least show Google data so UI isn't empty
          setProfile({
            displayName: authUser.displayName,
            email:       authUser.email,
            photoURL:    authUser.photoURL,
          });
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Re-fetch full profile from Firestore and sync local state
  const refreshProfile = async () => {
    if (!user) return;
    try {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        setProfile({
          displayName: user.displayName,
          email:       user.email,
          photoURL:    user.photoURL,
          ...docSnap.data(),
        });
      }
    } catch (err) {
      console.error("Error refreshing profile:", err);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const updateProfilePicture = async (avatarUrl) => {
    if (!user) throw new Error("No user logged in");
    await updateDoc(doc(db, "users", user.uid), { avatarUrl });
    setProfile((prev) => ({ ...prev, avatarUrl }));
  };

  const updatePreferences = async (preferences) => {
    if (!user) throw new Error("No user logged in");
    await updateDoc(doc(db, "users", user.uid), { preferences });
    setProfile((prev) => ({ ...prev, preferences }));
  };

  if (loading) return <Loading />;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        setProfile,
        refreshProfile,   // ← expose this
        logout,
        updateProfilePicture,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);