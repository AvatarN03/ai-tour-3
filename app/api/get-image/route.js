import { NextResponse } from "next/server";
import axios from "axios";

const SEARCH_BASE_URL = 'https://places.googleapis.com/v1/places:searchText';
const API_KEY = process.env.GOOGLE_PLACE_API_KEY; // Your secret key from .env.local
console.log(API_KEY)
const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.photos' // We only need photos
    }
};

/**
 * Gets a real photo URL for a given search query.
 */
async function getPlacePhotoUrl(textQuery) {
    if (!textQuery || !API_KEY) return null;

    try {
        const data = { textQuery };
        const response = await axios.post(SEARCH_BASE_URL, data, config);
        const photoRef = response.data?.places?.[0]?.photos?.[0]?.name;

        if (photoRef) {
            const photoUrl = `https://places.googleapis.com/v1/${photoRef}/media?maxHeightPx=1000&maxWidthPx=1900&key=${API_KEY}`;
            return photoUrl;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching photo for "${textQuery}":`, error.message);
        return null;
    }
}

// The API Route handler
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeName = searchParams.get('placeName');
    const destination = searchParams.get('destination');

    if (!placeName) {
      return NextResponse.json({ error: 'Missing placeName' }, { status: 400 });
    }

    const searchQuery = `${placeName}, ${destination || ''}`;
    const imageUrl = await getPlacePhotoUrl(searchQuery);

    if (imageUrl) {
      return NextResponse.json({ imageUrl });
    } else {
      return NextResponse.json({ imageUrl: null }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}