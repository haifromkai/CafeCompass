// CAFES PAGE

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';


// Define a type for cafes
type Cafe = {
  id: number;
  name: string;
  address: string;
  rating: number; // Google Rating
  seating: number;
  outlets: number;
  noise: number;
  image: string;
};


// Cafes Page Component
export default function CafesPage() {

  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the passed query params from landing page
  const location = searchParams.get("selectedPlace");
  const radius = searchParams.get("radius");

  const [cafes, setCafes] = useState<Cafe[]>([]); // State for storing cafe data
  const [filter, setFilter] = useState<"seating" | "outlets" | "noise" | null>(null); // State for filter type



  // Fetch cafes using backend python script
  useEffect(() => {
    const fetchCafes = async () => {
      if (location && radius) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/cafes?selectedPlace=${encodeURIComponent(
              location
            )}&radius=${radius}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch cafes');
          }

          const data = await response.json();

          // Map the API response to your Cafe type with palceholder ratings
          const formattedCafes: Cafe[] = data.cafes.slice(0, 5).map((cafe: any, index: number) => ({
            id: index + 1,
            name: cafe.name,
            address: cafe.address,
            rating: cafe.rating || 0,
            seating: 3,  // placeholder
            outlets: 3,  // placeholder
            noise: 3,    // placeholder
            image: cafe.photo_url || "/images/default-cafe.avif"
          }));
          setCafes(formattedCafes);
        } catch (error) {
          console.error('Error fetching cafes:', error);
          setCafes([]);
        }
      }
    };

    fetchCafes();
  }, [location, radius]);



  // Function to sort cafes based on the selected filter
  const getSortedCafes = () => {
    if (!filter) return cafes; // Return unsorted cafes if no filter is selected

    return [...cafes].sort((a, b) => {
      if (filter === "seating") return b.seating - a.seating; // Highest seating ranked first
      if (filter === "outlets") return b.outlets - a.outlets; // Most outlets ranked first
      if (filter === "noise") return a.noise - b.noise;       // Most quiet ranked first
      return 0;
    });
  };

  return (
    // Main Container: centers content and applies cozy café colors
    <div className="flex flex-col items-center min-h-screen bg-[#0D1E1C] p-4">

      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 px-4 py-2 rounded-md 
        bg-[#f8f5f0] text-[#2c3639] hover:bg-[#5e503f] hover:text-white transition-colors"
      >
        ← Back
      </button>
      

      {/* Page Title: displays location-based search title */}
      <h1 className="text-3xl font-bold text-center text-[#ffffff] mb-4">
        Cafés in {location}
      </h1>
      <p className="text-xl font-bold text-center text-[#ffffff] mb-4">
        {radius} Mile Radius
      </p>


      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-4">
        <span className="text-white font-semibold">Filter By:</span>

        <button
          className={`px-4 py-2 rounded-md ${
            filter === "seating" ? "bg-[#5e503f] text-white" : "bg-[#f8f5f0] text-[#2c3639]"
          } hover:bg-[#8d7b68] hover:text-white transition-colors`}
          onClick={() => setFilter(filter === "seating" ? null : "seating")}
        >
          Seats
        </button>

        <button
          className={`px-4 py-2 rounded-md ${
            filter === "outlets" ? "bg-[#5e503f] text-white" : "bg-[#f8f5f0] text-[#2c3639]"
          } hover:bg-[#8d7b68] hover:text-white transition-colors`}
          onClick={() => setFilter(filter === "outlets" ? null : "outlets")}
        >
          Outlets
        </button>

        <button
          className={`px-4 py-2 rounded-md ${
            filter === "noise" ? "bg-[#5e503f] text-white" : "bg-[#f8f5f0] text-[#2c3639]"
          } hover:bg-[#8d7b68] hover:text-white transition-colors`}
          onClick={() => setFilter(filter === "noise" ? null : "noise")}
        >
          Quietness
        </button>

      </div>


      {/* Café List */}
      <div className="space-y-4">
        {getSortedCafes().map((cafe) => ( // use sorted version of cafes

          // Individual café card
          <div
            key={cafe.id} // unique key for React rendering
            className="flex items-center justify-between p-4 bg-[#f8f5f0] rounded-md w-[500px] 
            shadow-md text-[#2c3639] hover:bg-[#5e503f] hover:text-white transition-colors duration-500"
          >
            {/* Café Details: seats, outlets, and noise levels */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{cafe.name}</h2>

              {/* Format Address - one line if no street number, two lines if there is */}
              {/\d/.test(cafe.address.split(',')[0]) ? (
                <>
                  <p>{cafe.address.split(',')[0]}</p>
                  <p>{cafe.address.split(',').slice(1).join(',').trim()}</p>
                </>
              ) : (
                <p>{cafe.address}</p>
              )}

              <p className="mt-2">Google Rating: {cafe.rating}</p>

              <p>Seats: {"★".repeat(cafe.seating)}{"☆".repeat(5 - cafe.seating)}</p>
              <p>Outlets: {"★".repeat(cafe.outlets)}{"☆".repeat(5 - cafe.outlets)}</p>
              <p>Quietness: {"★".repeat(6 - cafe.noise)}{"☆".repeat(cafe.noise - 1)}</p>
            </div>

            {/* Café Image */}
            <img 
              src={cafe.image} 
              alt={`Image of ${cafe.name}`} 
              className="w-32 h-32 rounded-md object-cover ml-4"
            />
          </div>
        ))}
      </div>
    </div>
  );
}


// interface Cafe {
//   name: string;
//   rating: number;
//   address: string;
//   photo_url: string;
// }

// export default function CafesPage() {
//   const searchParams = useSearchParams();
//   const [cafes, setCafes] = useState<Cafe[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCafes = async () => {
//       try {
//         const selectedPlace = searchParams.get('selectedPlace');
//         const radius = searchParams.get('radius');

//         if (!selectedPlace || !radius) {
//           throw new Error('Missing search parameters');
//         }

//         const response = await fetch(
//           `http://localhost:8000/api/cafes?selectedPlace=${encodeURIComponent(
//             selectedPlace
//           )}&radius=${radius}`
//         );

//         if (!response.ok) {
//           throw new Error('Failed to fetch cafes');
//         }

//         const data = await response.json();
//         setCafes(data.cafes);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCafes();
//   }, [searchParams]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Top 5 Cafes</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {cafes.map((cafe, index) => (
//           <div key={index} className="border rounded-lg overflow-hidden shadow-lg">
//             {cafe.photo_url && (
//               <div className="relative h-48 w-full">
//                 <Image
//                   src={cafe.photo_url}
//                   alt={cafe.name}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             )}
//             <div className="p-4">
//               <h2 className="text-xl font-semibold mb-2">{cafe.name}</h2>
//               <p className="text-gray-600">Rating: {cafe.rating} ⭐</p>
//               <p className="text-gray-600 text-sm">{cafe.address}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
