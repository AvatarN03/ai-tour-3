  // import { GoogleGenerativeAI } from "@google/generative-ai";
  // import { NextResponse } from "next/server";

  // export async function POST(req) {
  //   try {
  //     // 1. Parse the incoming message from the frontend
  //     const body = await req.json();
  //     const { messages } = body;
  //     console.log(body)

  //     // 2. Initialize Gemini
  //     // We use the server-side key (GEMINI_API_KEY) or fallback to the public one if that's what you have
  //     const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GEMINI_APIKEY;
      
  //     if (!apiKey) {
  //       return NextResponse.json(
  //         { error: "GEMINI_API_KEY not configured in environment variables" },
  //         { status: 500 }
  //       );
  //     }
      
  //     const genAI = new GoogleGenerativeAI(apiKey);
      
  //     // 3. Select the model (flash is faster/cheaper for chat)
  //     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  //     console.log("heelo1")
      
  //     // 4. Format history for Gemini
  //     // The frontend sends roles as 'user'/'assistant', Gemini needs 'user'/'model'
  //     const history = messages.slice(0, -1).map((msg) => ({
  //       role: msg.role === "user" ? "user" : "model",
  //       parts: [{ text: msg.content }],
  //     }));

  //     const lastMessage = messages[messages.length - 1].content;

  //     // 5. Start Chat
  //     const chat = model.startChat({
  //       history: history,
  //     });

  //     // 6. Generate Response
  //     const result = await chat.sendMessage(lastMessage);
  //     const response = await result.response;
  //     const text = response.text();

  //     // 7. Send back to Frontend
  //     return NextResponse.json({ reply: text });

  //   } catch (error) {
  //     console.error("AI Chat Error:", error);
  //     return NextResponse.json(
  //       { error: "Failed to generate response" },
  //       { status: 500 }
  //     );
  //   }
  // }





//   import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { messages, userPreferences } = body;
    
//     const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GEMINI_APIKEY;
//     if (!apiKey) {
//       return NextResponse.json({ error: "API Key missing" }, { status: 500 });
//     }

//     const genAI = new GoogleGenerativeAI(apiKey);
    
//     // 1. Define the System Instruction
//     // This tells the AI how to behave: Ask questions first, then generate JSON.
//     const systemInstruction = `
//       You are an expert AI Travel Assistant. Your goal is to generate a detailed travel itinerary.
      
//       **Current User Preferences:** ${JSON.stringify(userPreferences || [])}
      
//       **Protocol:**
//       1. You must have the following 4 pieces of information from the user:
//          - Destination
//          - Duration (how many days)
//          - Budget (approximate amount and currency)
//          - Number of Travelers
         
//       2. If ANY of these 4 are missing, ask the user for them politely. Do not generate a plan yet.
      
//       3. Once you have ALL 4 pieces of info, generate a detailed itinerary based on their "User Preferences" (if available) and the gathered details.
      
//       4. **CRITICAL:** When generating the final plan, you MUST output a JSON object wrapped in \`\`\`json ... \`\`\` code block at the end of your response.
      
//       **JSON Schema:**
//       {
//         "tripDetails": {
//           "title": "Trip Title (e.g., Weekend in Paris)",
//           "destination": "City, Country",
//           "duration": "X days",
//           "budget": 5000,
//           "currency": "USD",
//           "travelers": 2
//         },
//         "hotel_options": [ ...3 options with name, address, price, rating, description... ],
//         "itinerary": [
//           {
//             "day": "Day 1",
//             "theme": "Arrival & Exploration",
//             "plan": [
//               {
//                 "place": "Place Name",
//                 "details": "Description of activity",
//                 "time": "Morning/Afternoon",
//                 "ticket_pricing": "Cost",
//                 "rating": 4.5
//               }
//             ]
//           }
//         ]
//       }
//     `;

//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-1.0-flash",
//       systemInstruction: systemInstruction 
//     });

//     // Format history
//     const history = messages.slice(0, -1).map((msg) => ({
//       role: msg.role === "user" ? "user" : "model",
//       parts: [{ text: msg.content }],
//     }));

//     const lastMessage = messages[messages.length - 1].content;

//     const chat = model.startChat({ history });
//     const result = await chat.sendMessage(lastMessage);
//     const response = await result.response;
//     const text = response.text();

//     return NextResponse.json({ reply: text });

//   } catch (error) {
//     console.error("Server Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }






// import Groq from "groq-sdk";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { messages, userPreferences } = body;
    
//     // 1. Initialize Groq
//     const apiKey = process.env.GROQ_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json({ error: "API Key missing" }, { status: 500 });
//     }
//     const groq = new Groq({ apiKey });

    // 2. Define System Instruction
//     const systemInstruction = `
// You are an expert AI Travel Assistant that generates structured, realistic, and budget-aware travel plans.

// ====================
// USER CONTEXT
// ====================
// Current User Preferences:
// ${JSON.stringify(userPreferences || [])}

// ====================
// MANDATORY PROTOCOL
// ====================

// 1. You MUST have ALL of the following information before generating a plan:
//    - Destination (city + country)
//    - Duration (number of days)
//    - Budget (numeric amount)
//    - Number of Travelers

// 2. If ANY of the above information is missing:
//    - DO NOT generate a travel plan
//    - Ask the user politely and clearly for the missing information only
//    - Ask concise follow-up questions

// 3. ONLY when ALL required information is available:
//    - Generate the FINAL travel plan
//    - Output MUST be valid JSON
//    - JSON MUST be wrapped inside a \`\`\`json ... \`\`\` code block
//    - DO NOT include explanations outside the JSON block

// ====================
// OUTPUT FORMAT (STRICT)
// ====================

// The final response MUST match this structure exactly:

// {
//   "GeneratedPlan": {
//     "destination": "City, Country",
//     "duration": "5 days",
//     "travel_type": "Solo / Couple / Family / Friends",
//     "budget_category": "Cheap / Mid-range / Luxury",
//     "total_estimated_cost": "1000 USD",
//     "best_season": "October to April",
    
//     "budget_breakdown": {
//       "accommodation": "250",
//       "food": "250",
//       "activities": "300",
//       "transportation": "100",
//       "miscellaneous": "100"
//     },

//     "hotel_options": [
//       {
//         "name": "Hotel Name",
//         "address": "Full address",
//         "geo_coordinates": "lat, lng",
//         "price_per_night": "50",
//         "rating": "4.0 stars",
//         "image_url": "https://example.com/hotel.jpg",
//         "description": "Short, realistic hotel description"
//       }
//     ],

//     "itinerary": [
//       {
//         "day": "Day 1",
//         "date": "YYYY-MM-DD",
//         "theme": "Daily theme",
//         "plan": [
//           {
//             "place": "Attraction name",
//             "details": "What the user will do here",
//             "best_time_to_visit": "Morning / Afternoon / Evening",
//             "time": "9:00 AM - 12:00 PM",
//             "time_to_spend": "3 hours",
//             "ticket_pricing": "Free / Paid",
//             "rating": "4.5 stars",
//             "geo_coordinates": "lat, lng",
//             "image_url": "https://example.com/place.jpg",
//             "travel_time_from_previous": "20 minutes"
//           }
//         ]
//       }
//     ],

//     "local_cuisine": [
//       "Dish 1",
//       "Dish 2",
//       "Dish 3"
//     ],

//     "transportation_tips": "Explain public transport, passes, taxis, apps, and best ways to move around",

//     "packing_suggestions": [
//       "Item 1",
//       "Item 2",
//       "Item 3"
//     ],

//     "safety_tips": [
//       "Tip 1",
//       "Tip 2",
//       "Tip 3"
//     ]
//   }
// }

// ====================
// IMPORTANT RULES
// ====================

// - All prices must be realistic and budget-consistent
// - Use real attractions and locations
// - Dates must align with duration
// - No hallucinated warnings
// - No markdown outside the JSON block
// - NO trailing commas
// - Output MUST be valid parsable JSON

// ====================
// END OF INSTRUCTIONS
// ====================
// `;








// const systemInstruction = `
// You are an expert AI Travel Assistant.

// ====================
// USER CONTEXT
// ====================
// Current User Preferences:
// ${JSON.stringify(userPreferences || [])}

// ====================
// PROTOCOL
// ====================

// 1. You MUST have ALL of the following information:
//    - Destination
//    - Duration (number of days)
//    - Budget
//    - Number of Travelers

// 2. If ANY of the above is missing:
//    - Ask the user politely for ONLY the missing information
//    - Do NOT generate a travel plan yet

// 3. Once ALL required information is available:
//    - Generate a complete travel itinerary
//    - Output MUST be valid JSON
//    - JSON MUST be wrapped inside \`\`\`json ... \`\`\`
//    - Do NOT include any explanation outside the JSON block

// ====================
// JSON FORMAT (STRICT)
// ====================

// {
//   "tripDetails": {
//     "title": "Trip Title (e.g., Dubai Diaries)",
//     "destination": "City, Country",
//     "duration": "5 days",
//     "budget": 2000,
//     "currency": "USD",
//     "travelers": 2
//   },

//   "hotel_options": [
//     {
//       "name": "Hotel Name",
//       "address": "Full address",
//       "price_per_night": "50",
//       "rating": 4.0,
//       "description": "Short, realistic description",
//       "image_url": "https://example.com/hotel.jpg",
//       "geo_coordinates": "lat, lng"
//     }
//   ],

//   "itinerary": [
//     {
//       "day": "Day 1",
//       "theme": "Arrival & Exploration",
//       "plan": [
//         {
//           "place": "Attraction name",
//           "details": "What the user will do",
//           "time": "Morning / Afternoon / Evening",
//           "ticket_pricing": "Free / Paid",
//           "rating": 4.5,
//           "geo_coordinates": "lat, lng",
//           "image_url": "https://example.com/place.jpg"
//         }
//       ]
//     }
//   ]
// }

// ====================
// IMPORTANT RULES
// ====================

// - Keep responses concise but complete
// - Use real locations and attractions
// - Ensure budget matches the plan
// - No markdown outside the JSON block
// - No trailing commas
// - JSON must be parsable

// ====================
// END OF INSTRUCTIONS
// ====================
// `;


   
//     // 3. Prepare Messages (Groq uses 'system' role unlike Gemini's separate config)
//     const allMessages = [
//       { role: "system", content: systemInstruction },
//       ...messages.map((msg) => ({
//         role: msg.role === "user" ? "user" : "assistant", // Groq uses 'assistant', not 'model'
//         content: msg.content || "",
//       })),
//     ];

//     // 4. Call Groq API (Llama 3.3 70B is smart & fast)
//     const completion = await groq.chat.completions.create({
//       messages: allMessages,
//       model: "llama-3.3-70b-versatile", // Best balance of speed/intelligence
//       temperature: 0.7,
//       max_completion_tokens: 1024,
//     });

//     const reply = completion.choices[0]?.message?.content || "";

//     return NextResponse.json({ reply });

//   } catch (error) {
//     console.error("Groq Error:", error);
//     return NextResponse.json(
//       { error: "Failed to process request" },
//       { status: 500 }
//     );
//   }
// }


import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, userPreferences } = body;
    
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }
    const groq = new Groq({ apiKey });

    // Updated System Instruction:
    // 1. Explicitly handles "From -> To" logic.
    // 2. Enforces the specific JSON format you need.
    const systemInstruction = `
      You are an expert AI Travel Assistant.
      
      **Current User Preferences:** ${JSON.stringify(userPreferences || [])}
      
      **Protocol:**
      1. Analyze the user's request to identify:
         - **Destination** (Where they want to go)
         - **Source** (Where they are coming from, if mentioned)
         - **Duration** (How many days)
         - **Budget**
         - **Travelers**
      
      2. If the user says "Plan a trip to X from Y", the DESTINATION is X. Do not say it is impossible to travel between countries.
      
      3. If specific details (Destination, Duration, Budget, Travelers) are missing, ask for them politely.
      
      4. Once you have the details, generate a **COMPLETE** JSON plan. Do not cut it off.
      
      **JSON Schema (Strictly follow this structure):**
      {
        "tripDetails": {
          "title": "Short catchy title",
          "destination": "City, Country",
          "duration": "5 days",
          "budget": 2000,
          "currency": "USD",
          "travelers": 2
        },
        "budget_category": "Cheap | Moderate | Luxury",
        "total_estimated_cost": "Total cost string",
        "best_season": "Best time to visit string",
        "travel_type": "Solo | Couple | Family | Friends",
        "budget_breakdown": {
          "accommodation": "Estimated cost",
          "activities": "Estimated cost",
          "food": "Estimated cost",
          "transportation": "Estimated cost",
          "miscellaneous": "Estimated cost"
        },
        "transportation_tips": "Advice on getting around",
        "hotel_options": [
          {
            "name": "Hotel Name",
            "address": "Full Address",
            "price_per_night": "Amount",
            "image_url": "URL or placeholder",
            "geo_coordinates": "lat, long",
            "rating": "4.5 stars",
            "description": "Short description"
          }
        ],
        "itinerary": [
          {
            "day": "Day 1",
            "date": "YYYY-MM-DD",
            "theme": "Day Theme",
            "plan": [
              {
                "place": "Place Name",
                "details": "Activity details",
                "image_url": "URL or placeholder",
                "geo_coordinates": "lat, long",
                "ticket_pricing": "Cost",
                "rating": "4.5 stars",
                "time": "Morning/Afternoon/Evening",
                "time_to_spend": "e.g., 2 hours",
                "travel_time_from_previous": "e.g., 15 minutes",
                "best_time_to_visit": "e.g., Morning"
              }
            ]
          }
        ],
        "local_cuisine": ["Dish 1", "Dish 2", "Dish 3"],
        "packing_suggestions": ["Item 1", "Item 2"],
        "safety_tips": ["Tip 1", "Tip 2"]
      }
    `;

    const allMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content || "",
      })),
    ];

    const completion = await groq.chat.completions.create({
      messages: allMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 8000, // INCREASED from 1024 to 8000 to prevent cut-off
    });

    const reply = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Groq Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}


