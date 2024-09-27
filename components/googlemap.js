'use client';

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

let loader;

if (!loader) {
  loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API, // Your Google Maps API key
    version: "quarterly",
  });
}

const GoogleMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        await loader.load();

        if (mapRef.current) {
          const location = { lat: 13.888100396349587, lng: 100.81018342052593 }; // Coordinates for Camels Cafe & Restaurant
          const placeName = "Camels Cafe & Restaurant Khu Fang Nuea, Nong Chok, Bangkok 10530, Thailand";

          // Initialize the map
          const map = new google.maps.Map(mapRef.current, {
            center: location,
            zoom: 15,
          });

          // Add a marker at the specified location and assign it to a variable
          const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: "Camels Cafe & Restaurant", // Optional: Title on hover
          });

          // Add a click listener to the marker to open Google Maps
          marker.addListener("click", () => {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}&query_place_id=ChIJ5Q1e1a-3ajcR6VvKn2X7qds&destination=${location.lat},${location.lng}`;
            window.open(googleMapsUrl, "_blank");
          });
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px" }} // Customize map size
    />
  );
};

export default GoogleMap;
