// LANDING PAGE

"use client";

// Import hooks and utilities
import { useState } from "react";
import { useRouter } from "next/navigation";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

// Home Component (includes app title, description, form, city autocomplete component)
export default function Home() {
  // State to store the user's selected city
  const [selectedPlace, setSelectedPlace] = useState("");
  const [radius, setRadius] = useState("5") // search radius (default 5 miles)
  const router = useRouter(); // next.js router for page navigation

  // Form submit handler: redirects user to the cafes page w/ selected city as query parameter
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevents default form submission behavior
    if (selectedPlace.trim()) {
      // navigate to cafes page
      router.push(`/cafes?location=${encodeURIComponent(selectedPlace)}`);
    }
  };

  return (
    // Main Container for Landing Page: styled w/ cozy café color theme
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D1E1C] p-4">

      {/* App Title: CaféCompass */}
      <h1 className="text-5xl font-bold text-center text-[#ffffff] mb-4">☕ CaféCompass ☕</h1>

      {/* App Subtitle: brief description of app */}
      <p className="text-lg text-center text-[#ffffff] mb-8">Find study-friendly cafés near you with great seating, outlets, and quiet vibes</p>

      {/* Form Section: retrieves user input for city via Autocomplete Component */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <PlacesAutocomplete setSelectedPlace={setSelectedPlace} />

        {/* Search Radius Selection: allows user to specify search radius in miles */}
        <label className="text-white mb-2">Search Radius: {radius} {radius === "1" ? "mile" : "miles"}
        </label>
        <input
          type="range"
          min="1"
          max="15"
          step="1"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="w-80 h-2 bg-[#8d7b68] rounded-lg appearance-none cursor-pointer 
                     accent-[#5e503f] hover:opacity-70 transition-opacity duration-300"
         />

        {/* Submit Button: redirects to /cafes with city as query parameter */}
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

// Autocomplete Component: provides dropdown w/ city suggestions based on user string input
const PlacesAutocomplete = ({ setSelectedPlace }: { setSelectedPlace: (value: string) => void }) => {
  // hook to initialize Places Autocomplete and manage its state
  const {
    ready, // indicate if API is ready to use
    value, // current input val
    suggestions: { status, data }, // suggestions returned by API
    setValue, // updates input val
    clearSuggestions, // clears dropdown suggestions
  } = usePlacesAutocomplete({
    debounce: 300, // delay API call to optimize performance
    // restrict results to cities
    requestOptions: {
      types: ["(cities)"],
    },
  });

  // Hook to detect mouse click outside the autocomplete dropdown
  const ref = useOnclickOutside(() => {
    clearSuggestions(); // close suggestions when clicking outside
  });

  // Handle input changes and updates autocomplete vals
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value); // update the input val
  };

  // Handles selection of a city from the dropdown
  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      setValue(description, false); // set val w/out additional API request
      clearSuggestions();
      setSelectedPlace(description); // pass the selected place to parent component

      // get coordinates of the city (future feature)
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        console.log("📍 Coordinates: ", { lat, lng });
      });
    };

  // Renders the dropdown list of autocomplete suggestions
  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id, // unique id for the city
        structured_formatting: { main_text, secondary_text }, // main and secondary parts of the city
      } = suggestion;

      return (
        <li
          key={place_id} // unique key for React rendering
          onClick={handleSelect(suggestion)} // handle selection of suggestion
          className="p-2 cursor-pointer hover:bg-[#8d7b68] hover:text-black"
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    // Autocomplete input and dropdown container
    <div ref={ref} className="w-80">
      <input
        value={value} // binds input val to PlacesAutocomplete state
        onChange={handleInput} // handles input changes
        disabled={!ready} // diasables input if API not ready
        placeholder="Type in your city"
        className="w-full p-2 border border-[#8d7b68] rounded-md text-[#2c3639] bg-[#f8f5f0] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8d7b68] focus:bg-[#eae5db]"
      />
      {status === "OK" && (
        <ul className="bg-[#5e503f] border border-[#8d7b68] rounded-md shadow-md mt-2 max-h-48 overflow-auto">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
};
