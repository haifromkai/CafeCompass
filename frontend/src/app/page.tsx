// LANDING PAGE

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [location, setLocation] = useState(""); // state to hold user's location input
  const router = useRouter(); // next.js router for page navigation
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault(); // prevents page reload

    if (location.trim()) {
      // navigate to Cafes page w/ location as query parameter
      router.push(`/cafes?location=${encodeURIComponent(location)}`);
    }
  };
  
  
  
  return (
    // Main Container: centers content vertically and horizonally w/ cozy café color theme
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D1E1C] p-4">

      {/* App Title: CaféCompass */}
      <h1 className="text-5xl font-bold text-center text-[#ffffff] mb-4">
        ☕ CaféCompass ☕
      </h1>

      {/* App Subtitle: brief description of app */}
      <p className="text-lg text-center text-[#ffffff] mb-8">
        Find study-friendly cafés near you with great seating, outlets, and quiet vibes
      </p>

      {/* Form Section: retrieves user input for location */}
      <form
        onSubmit={handleSubmit} // attach the form submit handler
        className="flex flex-col items-center space-y-4">

        {/* Input Box: allow user to enter their location */}
        <input
          type="text"
          placeholder="Enter your location"
          value={location} // bind input value to state
          onChange={(e) => setLocation(e.target.value)} // update state on input change
          className="w-80 p-2 border border-[#8d7b68] rounded-md text-[#2c3639] bg-[#f8f5f0] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8d7b68] focus:bg-[#eae5db]"
        />

        {/* Submit Button: redirects to /cafes with location as query parameter */}
        <button
          type="submit"
          className="px-6 py-2 bg-[#8d7b68] text-white rounded-md hover:bg-[#5e503f] font-bold"
        >
          Search
        </button>
      </form>
    </div>
  );
}
