"use server";

/**
 * Server Action: AI Travel Plan Generation
 * Uses GOOGLE_GEMINI_APIKEY (server-only env var — remove NEXT_PUBLIC_ prefix)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

import { CURRENCY_OPTIONS } from "@/lib/constants";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_APIKEY);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const SYSTEM_HISTORY = [
  {
    role: "user",
    parts: [
      {
        text: `You are an expert travel planner AI. Generate comprehensive travel plans based on user requirements.

When given a travel request with Location, Duration (in days), Travel Type (Solo/Couple/Family/Friends), Budget, and Currency, provide:

1. **Hotel Options** (3-5 options):
   - Hotel Name
   - Complete Address
   - Price per night (in the specified currency)
   - Hotel Image URL (use placeholder if needed)
   - Geo Coordinates (latitude, longitude)
   - Star Rating (out of 5)
   - Detailed Description (amenities, highlights, location benefits)

2. **Day-by-Day Itinerary**:
   For each day, provide 3-4 activities with:
   - Time slot (Morning/Afternoon/Evening with specific hours)
   - Place Name
   - Detailed Description (what to do, why visit, highlights)
   - Place Image URL (use placeholder if needed)
   - Geo Coordinates (latitude, longitude)
   - Ticket Pricing (in the specified currency, or "Free" if no cost)
   - Rating (out of 5 stars)
   - Estimated time to spend at location
   - Best time to visit this attraction

3. **Additional Information**:
   - Transportation tips between locations
   - Approximate travel time between attractions
   - Budget breakdown (accommodation, activities, food, transport) in the specified currency
   - Local cuisine recommendations
   - Safety tips and important notes
   - Best season to visit

IMPORTANT: All monetary values must be in the currency specified by the user. Use realistic prices based on the destination and currency.

Format the response as valid JSON with the following structure:
{
  "destination": "Location Name",
  "duration": "X days",
  "travel_type": "Solo/Couple/Family/Friends",
  "budget_category": "Cheap/Moderate/Luxury",
  "currency": "USD/INR/EUR/GBP/AUD/JPY",
  "total_estimated_cost": "amount",
  "hotel_options": [
    {
      "name": "",
      "address": "",
      "price_per_night": "amount",
      "image_url": "",
      "geo_coordinates": "lat,lng",
      "rating": "X.X stars",
      "description": ""
    }
  ],
  "itinerary": [
    {
      "day": "Day X",
      "date": "Optional",
      "theme": "Nature/Culture/Adventure/Relaxation",
      "plan": [
        {
          "time": "Morning (9:00 AM - 12:00 PM)",
          "place": "",
          "details": "",
          "image_url": "",
          "geo_coordinates": "lat,lng",
          "ticket_pricing": "amount or Free",
          "rating": "X.X stars",
          "time_to_spend": "X hours",
          "best_time_to_visit": "",
          "travel_time_from_previous": "X minutes"
        }
      ]
    }
  ],
  "transportation_tips": "",
  "budget_breakdown": {
    "accommodation": "amount",
    "activities": "amount",
    "food": "amount",
    "transportation": "amount",
    "miscellaneous": "amount"
  },
  "local_cuisine": [],
  "safety_tips": [],
  "best_season": "",
  "packing_suggestions": []
}

Ensure all recommendations match the budget category, travel type, and use the correct currency.`,
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: `Understood! I'm ready to generate comprehensive travel plans with currency-specific pricing. I will:

1. Provide 3-5 hotel options with prices in the specified currency
2. Create detailed day-by-day itineraries with 3-4 activities per day
3. Include accurate geo-coordinates, pricing in the correct currency, and ratings
4. Add transportation tips and travel times between locations
5. Provide budget breakdowns in the specified currency
6. Use realistic local prices based on the destination and currency
7. Format everything as valid JSON

Please provide the travel requirements: Location, Duration, Travel Type, Budget, and Currency.`,
      },
    ],
  },
];

/** Resolve currency symbol from shared CURRENCY_OPTIONS constant */
function getCurrencySymbol(currency) {
  return CURRENCY_OPTIONS.find((c) => c.value === currency)?.symbol ?? currency;
}

/** Determine budget category based on per-person spend and currency */
function resolveBudgetCategory(budgetPerPerson, currency) {
  const thresholds = {
    INR: { luxury: 300000, moderate: 80000 },
    USD: { luxury: 4000, moderate: 1500 },
    EUR: { luxury: 3500, moderate: 1300 },
    GBP: { luxury: 3500, moderate: 1300 },
    JPY: { luxury: 500000, moderate: 180000 },
    AUD: { luxury: 5500, moderate: 2000 },
  };
  const t = thresholds[currency] ?? thresholds.USD;
  if (budgetPerPerson > t.luxury) return "Luxury";
  if (budgetPerPerson > t.moderate) return "Moderate";
  return "Cheap";
}

/** Determine travel type from headcount */
function resolveTravelType(persons) {
  if (persons === 1) return "Solo";
  if (persons === 2) return "Couple";
  if (persons <= 4) return "Family";
  return "Friends";
}

/** Create a fresh chat session per request (stateless server action) */
function createChatSession() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig,
  });
  return model.startChat({ history: SYSTEM_HISTORY });
}

export async function generateTravelPlan(formData) {
  const {
    title,
    category,
    description,
    destination,
    source,
    budget,
    currency = "USD",
    days,
    persons,
    startDate,
    interests,
    accommodation,
    transportation,
    activities,
    dietaryRestrictions,
    specialRequests,
  } = formData;

  const currencySymbol = getCurrencySymbol(currency);
  const budgetCategory = resolveBudgetCategory(budget / persons, currency);
  const travelType = resolveTravelType(persons);

  const prompt = `Generate a comprehensive travel plan with the following details:

**Trip Overview:**
- Title: ${title}
- Category: ${category}
- Description: ${description || "Not specified"}
- Starting From: ${source}
- Destination: ${destination}
- Duration: ${days} days
- Start Date: ${startDate}
- Number of Travelers: ${persons}
- Total Budget: ${currencySymbol}${budget} (${currency})
- Budget Category: ${budgetCategory}
- Travel Type: ${travelType}
- Currency: ${currency}

**Preferences:**
- Interests: ${interests?.length > 0 ? interests.join(", ") : "General sightseeing"}
- Accommodation Preferences: ${accommodation || "Standard hotels"}
- Transportation: ${transportation || "Local transport and taxis"}
- Specific Activities: ${activities || "Popular tourist attractions"}
- Dietary Restrictions: ${dietaryRestrictions || "None"}
- Special Requests: ${specialRequests || "None"}

**Requirements:**
1. Provide 3-5 hotel options matching the ${budgetCategory} budget category
2. ALL PRICES MUST BE IN ${currency} (${currencySymbol}). Use realistic local prices for ${destination}.
3. Create a detailed ${days}-day itinerary with 3-4 activities per day
4. Include activities aligned with: ${interests?.join(", ") || "general tourism"}
5. Consider dietary restrictions: ${dietaryRestrictions || "None"}
6. Factor in starting location (${source}) for transportation planning
7. Keep total estimated cost within ${currencySymbol}${budget} ${currency}
8. Include specific activities if mentioned: ${activities || "None"}
9. Consider special requests: ${specialRequests || "None"}
10. CRITICAL: All monetary values must be realistic amounts in ${currency}

Provide everything in the specified JSON format with geo-coordinates, ${currency} pricing, ratings, and travel times.`;

  try {
    const chatSession = createChatSession();
    const result = await chatSession.sendMessage(prompt);
    const response = result.response;

    const responseText =
      typeof response === "string"
        ? response
        : typeof response?.text === "function"
          ? await response.text()
          : JSON.stringify(response);

    const travelPlan = JSON.parse(responseText);

    return {
      ...travelPlan,
      currency,
      tripDetails: {
        title,
        category,
        description,
        source,
        startDate,
        interests,
        accommodation,
        transportation,
        activities,
        dietaryRestrictions,
        specialRequests,
      },
    };
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw new Error("Failed to generate travel plan. Please try again.");
  }
}