"use client";

import { GetPlaceDetails, PHOTO_REF_URL } from "@/lib/PlaceImage";
import React, { useState, useEffect } from "react";

const PlaceImage = ({ object }) => {
  const [photoUrl, setPhotoUrl] = useState("");

  const getPlacePhoto = async () => {
    if (!object?.name) return;

    try {
      const resp = await GetPlaceDetails({ textQuery: object.name });
      const photoName = resp.data.places[0]?.photos?.[0]?.name;
      if (photoName) {
        const url = PHOTO_REF_URL.replace("{NAME}", photoName);
        setPhotoUrl(url);
      }
    } catch (err) {
      console.error("Error fetching place photo:", err);
    }
  };

  useEffect(() => {
    getPlacePhoto();
  }, [object]);

  if (!photoUrl) return null;

  return (
    <img
      src={photoUrl}
      alt={object.name}
      className="w-full h-60 object-cover rounded-lg"
    />
  );
};

export default PlaceImage;
