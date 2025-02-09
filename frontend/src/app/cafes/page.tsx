// CAFES PAGE

"use client";

import { useSearchParams } from "next/navigation";

export default function CafesPage() {
  const searchParams = useSearchParams(); // hook to access query parameters from the URL
  const location = searchParams.get("location"); // retrieve the 'location' query parameter

  // dummy café data (to be replaced w/ real data later)
  const cafes = [
    { id: 1, name: "Cozy Corner Café", seating: "Great", outlets: "Available", noise: "Quiet" },
    { id: 2, name: "Green Bean Coffeehouse", seating: "Limited", outlets: "Few", noise: "Moderate" },
    { id: 3, name: "The Study Spot", seating: "Ample", outlets: "Plenty", noise: "Very Quiet" },
  ];

  return (
    // Main Container: centers content and applies cozy café colors
    <div className="flex flex-col items-center min-h-screen bg-[#0D1E1C] p-4">
      
      {/* Page Title: displays location-based search title */}
      <h1 className="text-3xl font-bold text-center text-[#ffffff] mb-4">
        Cafés Near {location || "Your Location"}
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
            <p>Seating: {cafe.seating}</p>
            <p>Outlets: {cafe.outlets}</p>
            <p>Noise: {cafe.noise}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
