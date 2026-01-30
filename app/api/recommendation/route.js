import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

export async function POST(request) {
  try {
    const { userId, userPreferences } = await request.json();
    console.log(userPreferences)

    if (!userId || !userPreferences) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch all trips
    const snapshot = await getDocs(collection(db, "trips"));
    const allTrips = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Score and filter trips
    const slotTrips = allTrips
      .filter(trip => trip.userId !== userId && trip.savedBy?.includes(userId) === false)
      .map(trip => {
        const tripInterests = trip.userSelection?.interests || [];
        // const matchCount = userPreferences.filter(pref =>
        //   tripInterests.includes(pref)
        // ).length;

        // Return only necessary data
        return {
          id: trip.id,
          title: trip.userSelection?.title || "Untitled Trip",
          destination: trip.userSelection?.destination || "Unknown",
          duration: trip.GeneratedPlan?.duration || trip.userSelection?.days + " days",
          budget: trip.GeneratedPlan?.total_estimated_cost || "N/A",
          interests: tripInterests,
          bestSeason: trip.GeneratedPlan?.best_season || "N/A",
          theme: trip.GeneratedPlan?.itinerary?.[0]?.theme || "",
          category: trip.userSelection?.category || "General",
        };
      })

    // Shuffle top scored trips and return top 3
   
    const recommendations = slotTrips.slice(0, 3);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}