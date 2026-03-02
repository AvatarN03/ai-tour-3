export function formatActivity(activity) {
  if (activity.entity === "TRIP") {
    switch (activity.action) {
      case "CREATE":
        return "Created a new trip";
      case "UPDATE":
        return "Updated a trip";
      case "DELETE":
        return "Deleted a trip";
      default:
        return "Trip activity";
    }
  }

  return `${activity.action} ${activity.entity}`;
}

