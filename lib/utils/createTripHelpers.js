// Helper functions for create-trip form

import { initialForm } from "@/lib/constants/trip";

/**
 * Merges query params from URL into the initial form data
 * Only picks keys that exist in initialForm to prevent leaking unexpected params
 */
export function buildInitialFormFromParams(searchParams) {
  const allowed = Object.keys(initialForm);
  const overrides = {};

  allowed.forEach((key) => {
    const val = searchParams.get(key);
    if (val !== null && val !== "") overrides[key] = val;
  });

  return { ...initialForm, ...overrides };
}

/**
 * Validates subscription plan limits before creating a trip
 */
export function checkSubscriptionLimit(profile) {
  if (profile?.subscription === "free" && (profile?.tripCount ?? 0) >= 7) {
    return {
      allowed: false,
      message: "Free plan allows only 7 trips. Upgrade to Pro 🚀",
    };
  }
  return { allowed: true };
}

/**
 * Resets form to initial state
 */
export function getResetFormData() {
  return { ...initialForm };
}
