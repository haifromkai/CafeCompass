// CAFES PAGE

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Define a type for cafes
type Cafe = {
  name: string;
  seating: number;
  outlets: number;
  noise: number;
  id: number;
};

// Cafes Page Component
export default function CafesPage() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location"); // Get 'location' query parameter
  const radius = searchParams.get("radius") || "5"; // Get 'radius' query parameter, default 5 miles

  // State for storing cafe data
  const [cafes, setCafes] = useState<Cafe[]>([]);

  useEffect(() => {
    // Fetch cafes based on location (use mock data for now)
    if (location) {
      const mockCafes: Cafe[] = [
        { id: 1, name: "Cafe A", seating: 4, outlets: 5, noise: 3 },
        { id: 2, name: "Cafe B", seating: 3, outlets: 4, noise: 4 },
        { id: 3, name: "Cafe C", seating: 5, outlets: 5, noise: 2 },
        { id: 4, name: "Cafe D", seating: 4, outlets: 3, noise: 3 },
        { id: 5, name: "Cafe E", seating: 3, outlets: 4, noise: 5 },
        { id: 6, name: "Cafe F", seating: 4, outlets: 4, noise: 4 },
        { id: 7, name: "Cafe G", seating: 2, outlets: 5, noise: 3 },
        { id: 8, name: "Cafe H", seating: 5, outlets: 3, noise: 2 },
        { id: 9, name: "Cafe I", seating: 4, outlets: 4, noise: 5 },
        { id: 10, name: "Cafe J", seating: 3, outlets: 3, noise: 4 },
      ];
      setCafes(mockCafes);
    }
  }, [location, radius]);

  return (
    // Main Container: centers content and applies cozy café colors
    <div className="flex flex-col items-center min-h-screen bg-[#0D1E1C] p-4">
      {/* Page Title: displays location-based search title */}
      <h1 className="text-3xl font-bold text-center text-[#ffffff] mb-4">
        Cafés in {location || "Your Location"} ({radius} Mile Radius)
      </h1>

      {/* Placeholder Café List */}
      <div className="space-y-4">
        {cafes.map((cafe) => (
          // Individual café card
          <div
            key={cafe.id} // unique key for React rendering
            className="p-4 bg-[#f8f5f0] rounded-md w-80 shadow-md text-[#2c3639] hover:bg-[#8d7b68] hover:text-white transition-colors duration-500"
          >
            {/* Café Name */}
            <h2 className="text-xl font-bold">{cafe.name}</h2>
            
            {/* Café Details: seating, outlets, and noise levels */}
            <p>Seating: {"★".repeat(cafe.seating)}{"☆".repeat(5 - cafe.seating)}</p>
            <p>Outlets: {"★".repeat(cafe.outlets)}{"☆".repeat(5 - cafe.outlets)}</p>
            <p>Noise: {"★".repeat(cafe.noise)}{"☆".repeat(5 - cafe.noise)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
