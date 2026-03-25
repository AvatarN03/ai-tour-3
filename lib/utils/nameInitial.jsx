import { useAuth } from "@/context/useAuth";

// Get user initials for fallback
export const getUserInitials = () => {
  const { profile } = useAuth();
  if (profile?.name) {
    return profile.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (profile?.email) {
    return profile.email[0].toUpperCase();
  }
  return "U";
};
