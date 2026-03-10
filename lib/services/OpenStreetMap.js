// lib/services/OpenStreetMap.js

// Coordinate cache to avoid rate limits
const coordinateCache = new Map();

// Fetch coordinates from OpenStreetMap Nominatim
export async function getCoordinates(placeName) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      placeName
    )}&format=json&limit=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "ai-tour-app",
        "Accept-Language": "en",
      },
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();

    if (!data || data.length === 0) return null;

    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  } catch (err) {
    console.error("Nominatim error:", err);
    return null;
  }
}

// Cached version to reduce API calls
export async function getCoordinatesCached(placeName) {
  if (coordinateCache.has(placeName)) {
    return coordinateCache.get(placeName);
  }

  const coords = await getCoordinates(placeName);

  if (coords) {
    coordinateCache.set(placeName, coords);
  }

  return coords;
}

// Generate static map image
export function getOSMMapImage(
  lat,
  lon,
  zoom = 15,
  width = 600,
  height = 400
) {
  return `https://staticmap.openstreetmap.fr/map.php?center=${lat},${lon}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lon},red`;
}