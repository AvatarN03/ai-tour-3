
# AI Tour

AI Tour is a modern travel planning web app built with Next.js, Tailwind CSS, Firebase, and AI-assisted itinerary generation. It provides trip creation with AI-generated plans, user authentication, blog features (posts & comments), image uploads, and helpful travel tools.

- Framework: Next.js (App Router)
- Styling: Tailwind CSS (+ shadcn/ui components)
- DB/Auth: Firebase (Firestore + Auth)
- AI: Google Generative AI (Gemini) helper (lib/AI_Model.js)
- Image uploads: Cloudinary (via API route)
- Language: JavaScript / React

---

## Features

- AI-generated travel itineraries from user input
- Create / edit / delete trips (stored in Firestore)
- Blog / Zone: create, edit, view posts with images and comments
- Image uploads via Cloudinary API route (fallback to data URLs locally)
- User auth & profile using Firebase Auth
- Utilities: currency, weather, OpenTripMap integrations
- Dark & light themes with accessible UI components

---

## Quickstart (local)

Requirements
- Node.js 18+ (recommended)
- npm / pnpm / yarn / bun
- Firebase project, Cloudinary account, Google Generative AI access (optional)

1. Install
```bash
npm install
# or pnpm install
# or yarn
```
