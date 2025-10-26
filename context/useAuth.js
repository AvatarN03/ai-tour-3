"use client"; // if using App Router in Next.js 13+

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Loading from "@/components/custom/Loading";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // Firebase Auth user
  const [profile, setProfile] = useState(null); // Firestore user profile
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser || null);
      setLoading(false);

      if (authUser) {
        // Fetch Firestore user profile
        try {
          const docRef = doc(db, "users", authUser.uid);
          const docSnap = await getDoc(docRef);
          setProfile(docSnap.exists() ? docSnap.data() : null);
        } catch (err) {
          console.error("Error fetching profile:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    console.log(user);
    console.log(profile);
    signOut(auth);
    setUser(null);
    setProfile(null);
  };

  // Update profile picture
  const updateProfilePicture = async (avatarUrl) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { avatarUrl });
      
      // Update local profile state
      setProfile((prev) => ({
        ...prev,
        avatarUrl,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  };

  // Update preferences
  const updatePreferences = async (preferences) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { preferences });
      
      // Update local profile state
      setProfile((prev) => ({
        ...prev,
        preferences,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  };

  // Generic update profile function (optional - for other fields)
  // const updateProfile = async (updates) => {
  //   if (!user) {
  //     throw new Error("No user logged in");
  //   }

  //   try {
  //     const userDocRef = doc(db, "users", user.uid);
  //     await updateDoc(userDocRef, updates);
      
  //     // Update local profile state
  //     setProfile((prev) => ({
  //       ...prev,
  //       ...updates,
  //     }));

  //     return { success: true };
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     throw error;
  //   }
  // };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile, 
        setProfile, 
        logout,
        updateProfilePicture,
        updatePreferences,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);