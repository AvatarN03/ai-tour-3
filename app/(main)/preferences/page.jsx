"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { useAuth } from "@/providers/useAuth";
import { categories } from "@/lib/utils/constant";

export default function PreferencesPage() {
  const searchParams = useSearchParams();

  const continueTo = searchParams.get("continueTo");
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();

  const togglePreference = (pref) => {
    setSelected((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
    );
    setError("");
  };

  const handleSubmit = async () => {
    if (selected.length < 3) {
      setError("Please select at least 3 preferences");
      return;
    }

    try {
      setLoading(true);
      await setDoc(
        doc(db, "users", user.uid),
        {
          preferences: selected,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      profile.preferences = selected;

      router.push(continueTo || "/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen flex items-start mt-12 justify-center px-4">
      <div className="max-w-xl w-full">
        <h1 className="text-2xl font-semibold mb-2">Tell us what you like</h1>
        <p className="text-gray-500 mb-6">
          Select at least 3 preferences so we can recommend better trips
        </p>
        <span className="text-sm bg-purple-600 p-2 rounded-md text-slate-200  my-4 block">
          You can change the preferences later in profile section
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          {categories.map((pref) => (
            <button
              key={pref}
              onClick={() => togglePreference(pref)}
              className={`border rounded-lg p-4 text-md transition cursor-pointer
                ${
                  selected.includes(pref)
                    ? "bg-accent dark:text-white border-purple-700 border-4"
                    : "hover:border-slate-500"
                }`}
            >
              {pref}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <hr className="border border-t-2 w-full h-[0.2px] bg-white mt-12" />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-purple-600 cursor-pointer text-white py-3 rounded-lg disabled:opacity-50 hover:bg-purple-700 transition"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
