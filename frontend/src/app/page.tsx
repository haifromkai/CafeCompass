// LANDING PAGE

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

export default function Home() {
  // const [location, setLocation] = useState(""); // state to hold user's location input
  const router = useRouter(); // next.js router for page navigation
  const [selectedPlace, setSelectedPlace] = useState<string>(""); // state for the selected place, typed as string

  
  // Initialize Google Places Autocomplete
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    requestOptions: {
      types: ["(cities)"], // restrict results to cities
    },
  });

  // Handle User selecting a suggestion
  const handleSelect = (address: string) => {
    setValue(address, false); // set input value
    clearSuggestions(); // clear dropdown suggestions
    setSelectedPlace(address); // store selected city in state
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault(); // prevents page reload

    if (selectedPlace.trim()) {
      // navigate to Cafes page w/ location as query parameter
      router.push(`/cafes?location=${encodeURIComponent(selectedPlace)}`);
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

        {/* Input Box: allow user to enter their location, with Autocomplete Feature */}
        <input
          type="text"
          placeholder="Enter your location"
          value={value} // bind input value to state
          onChange={(e) => setValue(e.target.value)} // update state on input change
          disabled={!ready} // disable input if API not ready
          className="w-80 p-2 border border-[#8d7b68] rounded-md text-[#2c3639] bg-[#f8f5f0] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8d7b68] focus:bg-[#eae5db]"
        />

        {/* Autocomplete Dropdown Suggestions */}
        {status === "OK" && (
          <ul className="bg-[#f8f5f0] border border-[#8d7b68] rounded-md shadow-md mt-2 max-h-48 overflow-auto">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)} // handle suggestion click
                className="p-2 cursor-pointer hover:bg-[#8d7b68] hover:text-white"
              >
                {description}
              </li>
            ))}
          </ul>
        )}

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
