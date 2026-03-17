"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { useAuth } from "@/providers/useAuth";
import { categories } from "@/lib/utils/constant";
import { toast } from "sonner";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export default function PreferencesPage() {
  const searchParams = useSearchParams();
  const continueTo = searchParams.get("continueTo");
  const router = useRouter();
  const { user, profile } = useAuth();

  const [selected, setSelected] = useState([]);
  const [username, setUsername] = useState(
    user?.displayName?.replace(/\s+/g, "").toLowerCase() || ""
  );
  const [usernameValid, setUsernameValid] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePreference = (pref) => {
    setSelected((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
    setError("");
  };

  const checkUsernameValid = async () => {
    // 1. Format check first — no Firestore read needed
    if (!USERNAME_REGEX.test(username)) {
      toast.error("3–20 characters: letters, numbers, or underscores only");
      setUsernameValid(false);
      return false;
    }

    // 2. Availability check
    try {
      const snapshot = await getDoc(doc(db, "usernames", username));
      if (snapshot.exists()) {
        toast.error("Username is already taken");
        setUsernameValid(false);
        setUsername("");
        return false;
      }
      toast.success("Username is available!");
      setUsernameValid(true);
      return true;
    } catch (err) {
      console.error("Error checking username:", err);
      toast.error("Could not verify username. Try again.");
      setUsernameValid(false);
      return false;
    }
  };

  const handleSubmit = async () => {
    const valid = await checkUsernameValid();
    if (!valid) return;

    if (selected.length < 3) {
      setError("Please select at least 3 preferences");
      return;
    }

    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setLoading(true);

      const batch = writeBatch(db);
      batch.set(
        doc(db, "users", user.uid),
        { username: username.trim(), preferences: selected, updatedAt: serverTimestamp() },
        { merge: true }
      );
      batch.set(doc(db, "usernames", username.trim()), { uid: user.uid });
      await batch.commit();

     

    } catch (err) {
      console.error("Batch write error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Fix useEffect to respect continueTo
  useEffect(() => {
    if (profile?.preferences?.length > 0 && profile?.username) {
      router.push(continueTo || "/dashboard");
    }
  }, [profile, router, continueTo]);

  return (
    <div className="min-h-screen flex items-start mt-12 justify-center px-4">
      <div className="max-w-xl w-full">
        <h1 className="text-2xl font-semibold mb-2">Set up your profile</h1>
        <p className="text-gray-500 mb-6">
          Choose a username and select at least 3 preferences
        </p>
        <span className="text-sm bg-purple-600 p-2 rounded-md text-slate-200 my-4 block">
          You can change these later in the profile section
        </span>

        {/* Username Field */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-1">Username</label>
          <div
            className={`flex items-center border rounded-lg px-3 py-2 transition focus-within:border-purple-600
              ${usernameValid ? "border-green-500" : ""}`}
          >
            <span className="text-gray-400 mr-1">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase());
                setUsernameValid(false); // reset validity on change
                setError("");
              }}
              onBlur={checkUsernameValid}
              placeholder="your_username"
              maxLength={20}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {usernameValid && (
              <span className="text-green-500 text-xs ml-2">✓ Available</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            3–20 characters. Letters, numbers, and underscores only.
          </p>
        </div>

        {/* Preferences Grid */}
        <h2 className="text-sm font-medium mb-3">Tell us what you like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((pref) => (
            <button
              key={pref.label}
              onClick={() => togglePreference(pref.label)}
              className={`border rounded-lg p-4 text-md transition cursor-pointer
                ${selected.includes(pref.label)
                  ? "bg-accent dark:text-white border-purple-700 border-4"
                  : "hover:border-slate-500"
                }`}
            >
              {pref.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <hr className="border border-t-2 w-full h-[0.2px] bg-white mt-12" />

        <button
          onClick={handleSubmit}
          disabled={loading || selected.length < 3}
          className="mt-6 w-full bg-purple-600 cursor-pointer text-white py-3 rounded-lg disabled:opacity-50 hover:bg-purple-700 transition"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}