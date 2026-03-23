
"use client";

import React, { useState, useEffect } from "react";

import {
  getCoordinatesCached,
  getOSMMapImage,
} from "@/lib/services/openStreetMap";
import { getWikiImage } from "@/lib/services/wikiImage";


const PlaceImage = ({ object }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!object?.name) {
      setIsLoading(false);
      return;
    }

    const loadImage = async () => {
      try {
        // 1️⃣ Try Wikipedia Image
        const wikiImage = await getWikiImage(object.name);

        if (wikiImage) {
          setImageUrl(wikiImage);
          setIsLoading(false);
          return;
        }

        // 2️⃣ Fallback to Unsplash
        const unsplashUrl = `https://source.unsplash.com/600x400/?${encodeURIComponent(
          object.name
        )}`;

        setImageUrl(unsplashUrl);

        // 3️⃣ If Unsplash fails → fallback to map
        const coords = await getCoordinatesCached(object.name);

        if (coords?.lat && coords?.lon) {
          const mapUrl = getOSMMapImage(coords.lat, coords.lon);
          setImageUrl(mapUrl);
        }
      } catch (err) {
        console.error("Image loading error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [object?.name]);

  if (isLoading) {
    return (
      <div className="w-full h-60 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-lg" />
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full h-60 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          No image available
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={object.name}
      loading="lazy"
      className="w-full h-60 object-cover rounded-lg"
      onError={(e) => {
        e.currentTarget.src =
          "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
      }}
    />
  );
};

export default PlaceImage;