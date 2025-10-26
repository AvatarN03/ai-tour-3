import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_APIKEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
}); 

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Currency symbols mapping
const CURRENCY_SYMBOLS = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  JPY: "¥"
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
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

Ensure all recommendations match the budget category, travel type, and use the correct currency. Prioritize realistic, accessible locations and accurate pricing information.`
        }
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

Please provide the travel requirements: Location, Duration, Travel Type, Budget, and Currency.`
        }
      ],
    },
  ],
});

// Function to generate travel plan based on form data
export async function generateTravelPlan(formData) {

  const {
    title,
    category,
    description,
    destination,
    source,
    budget,
    currency = 'USD', // Default to USD if not specified
    days,
    persons,
    startDate,
    interests,
    accommodation,
    transportation,
    activities,
    dietaryRestrictions,
    specialRequests
  } = formData;

  // Get currency symbol
  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

  // Determine budget category based on amount and persons
  const budgetPerPerson = budget / persons;
  let budgetCategory = 'Cheap';
  
  // Adjust budget thresholds based on currency
  if (currency === 'INR') {
    if (budgetPerPerson > 300000) budgetCategory = 'Luxury';
    else if (budgetPerPerson > 80000) budgetCategory = 'Moderate';
  } else if (currency === 'USD') {
    if (budgetPerPerson > 4000) budgetCategory = 'Luxury';
    else if (budgetPerPerson > 1500) budgetCategory = 'Moderate';
  } else if (currency === 'EUR' || currency === 'GBP') {
    if (budgetPerPerson > 3500) budgetCategory = 'Luxury';
    else if (budgetPerPerson > 1300) budgetCategory = 'Moderate';
  } else if (currency === 'JPY') {
    if (budgetPerPerson > 500000) budgetCategory = 'Luxury';
    else if (budgetPerPerson > 180000) budgetCategory = 'Moderate';
  } else if (currency === 'AUD') {
    if (budgetPerPerson > 5500) budgetCategory = 'Luxury';
    else if (budgetPerPerson > 2000) budgetCategory = 'Moderate';
  }

  // Determine travel type based on persons
  let travelType = 'Solo';
  if (persons === 2) travelType = 'Couple';
  else if (persons > 2 && persons <= 4) travelType = 'Family';
  else if (persons > 4) travelType = 'Friends';

  const prompt = `Generate a comprehensive travel plan with the following details:

**Trip Overview:**
- Title: ${title}
- Category: ${category}
- Description: ${description || 'Not specified'}
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
- Interests: ${interests.length > 0 ? interests.join(', ') : 'General sightseeing'}
- Accommodation Preferences: ${accommodation || 'Standard hotels'}
- Transportation: ${transportation || 'Local transport and taxis'}
- Specific Activities: ${activities || 'Popular tourist attractions'}
- Dietary Restrictions: ${dietaryRestrictions || 'None'}
- Special Requests: ${specialRequests || 'None'}

**Requirements:**
1. Provide 3-5 hotel options that match the budget category (${budgetCategory}) and accommodation preferences
2. ALL PRICES MUST BE IN ${currency} (${currencySymbol}). Use realistic local prices for ${destination}.
3. Create a detailed ${days}-day itinerary with 3-4 activities per day
4. Include activities that align with these interests: ${interests.join(', ') || 'general tourism'}
5. Consider the dietary restrictions: ${dietaryRestrictions || 'None'}
6. Factor in the starting location (${source}) for transportation planning
7. Ensure the total estimated cost stays within or near the budget of ${currencySymbol}${budget} ${currency}
8. If specific activities were mentioned (${activities}), try to include them in the itinerary
9. Consider special requests: ${specialRequests || 'None'}
10. CRITICAL: All monetary values (hotel prices, ticket prices, food costs, transportation costs) must be realistic amounts in ${currency}

Provide everything in the specified JSON format with complete details including geo-coordinates, pricing in ${currency}, ratings, and travel times.`;

  try {
    const result = await chatSession.sendMessage(prompt);
    const response = result.response;
    const travelPlan = JSON.parse(response.text());
    
    // Add the original form data to the response
    return {
      ...travelPlan,
      currency: currency, // Ensure currency is included in response
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
        specialRequests
      }
    };
  } catch (error) {
    console.error('Error generating travel plan:', error);
    throw new Error('Failed to generate travel plan. Please try again.');
  }
}