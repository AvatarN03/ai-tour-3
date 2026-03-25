import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { getLastMonths, getMonthKey } from "@/lib/utils";
import { MONTHS_TO_SHOW } from "@/lib/constants";

export const getInsightsAction = async ({ userId, activityCount }) => {
  try {
    // Trips
    const tripsSnap = await getDocs(collection(db, "users", userId, "trips"));
    const trips = tripsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const totalSpent = trips.reduce(
      (acc, trip) => acc + Number(trip?.userSelection?.budget || 0),
      0
    );
    const totalDaysTraveling = trips.reduce(
      (acc, trip) => acc + Number(trip?.userSelection?.days || 0),
      0
    );
    const destinationCounts = trips.reduce((acc, trip) => {
      const dest = trip?.userSelection?.destination || "Unknown";
      acc[dest] = (acc[dest] || 0) + 1;
      return acc;
    }, {});
    const favoriteDestination =
      Object.entries(destinationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    const averageTripCost = trips.length ? totalSpent / trips.length : 0;

    const lastMonths = getLastMonths(MONTHS_TO_SHOW);
    const monthMap = lastMonths.reduce((acc, month) => {
      acc[month] = { month, trips: 0, spending: 0 };
      return acc;
    }, {});
    trips.forEach((trip) => {
      const createdAt = trip?.createdAt?.toDate ? trip.createdAt.toDate() : new Date();
      const monthKey = getMonthKey(createdAt);
      if (!monthMap[monthKey]) monthMap[monthKey] = { month: monthKey, trips: 0, spending: 0 };
      monthMap[monthKey].trips += 1;
      monthMap[monthKey].spending += Number(trip?.userSelection?.budget || 0);
    });
    const monthlyTrends = Object.values(monthMap);

    const categoryMap = trips.reduce((acc, trip) => {
      const category = trip?.userSelection?.category || "Other";
      const amount = Number(trip?.userSelection?.budget || 0);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});
    const expenseTotal = Object.values(categoryMap).reduce((s, v) => s + v, 0);
    const expenseBreakdown = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: expenseTotal ? Math.round((amount / expenseTotal) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Blog posts count
    const blogPostsSnap = await getDocs(
      query(collection(db, "blog_posts"), where("authorUid", "==", userId))
    );

    // Activities
    const activitiesSnap = await getDocs(
      collection(db, "users", userId, "activities")
    );
    const activitiesByMonth = activitiesSnap.docs.reduce((acc, d) => {
      const data = d.data();
      const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt;
      if (!createdAt) return acc;
      const month = getMonthKey(createdAt);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const recentTrips = trips.slice(0, 5).map((trip) => ({
      id: trip.id,
      destination: trip?.userSelection?.destination || "Unknown",
      cost: Number(trip?.userSelection?.budget || 0),
      date:
        trip?.userSelection?.startDate ||
        (trip?.createdAt?.toDate ? trip.createdAt.toDate().toISOString().slice(0, 10) : ""),
      rating: trip?.rating || 0,
    }));

    return {
      success: true,
      data: {
        trips: trips.length,
        blogPosts: blogPostsSnap.size,
        activities: typeof activityCount === "number" ? activityCount : activitiesSnap.size,
        totalSpent,
        averageTripCost,
        favoriteDestination,
        totalDaysTraveling,
        recentTrips,
        allTrips: trips,
        monthlyTrends,
        expenseBreakdown,
        activitiesByMonth,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
