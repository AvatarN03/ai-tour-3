export async function getWikiImage(placeName) {
  try {
    const query = placeName.split(",")[0];

    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      query
    )}&prop=pageimages&format=json&pithumbsize=600&origin=*`;

    const res = await fetch(url);

    if (!res.ok) return null;

    const json = await res.json();

    const pages = json?.query?.pages;
    const page = Object.values(pages || {})[0];

    return page?.thumbnail?.source || null;
  } catch (err) {
    console.error("Wikipedia image error:", err);
    return null;
  }
}