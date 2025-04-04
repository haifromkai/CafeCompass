# Script to fetch cafe details from Google Places API

import googlemaps
from typing import List, Dict
import os
from dotenv import load_dotenv
from pathlib import Path

# Update the path to load the correct .env file
env_path = Path(__file__).parent / '.env.backend'
load_dotenv(dotenv_path=env_path)

api_key = os.getenv('GOOGLE_PLACES_API_KEY')
if not api_key:
    raise ValueError("API key not found in environment variables. Please check your .env.backend file.")



def fetch_cafes(location: str, radius: int) -> List[Dict]:
    gmaps = googlemaps.Client(key=api_key)
    
    geocode_result = gmaps.geocode(location)
    if not geocode_result:
        raise ValueError(f"Could not find location: {location}")
    
    lat = geocode_result[0]['geometry']['location']['lat']
    lng = geocode_result[0]['geometry']['location']['lng']
    
    # Create a list to store all results
    all_places = []
    
    # Search for each type
    for place_type in ['cafe', 'coffee']:
        places_result = gmaps.places_nearby(
            location=(lat, lng),
            type=place_type,
            keyword=f'{place_type}',
            radius=radius # places must be within this distance
        )
        if places_result.get('results'):
            all_places.extend(places_result.get('results'))
    
    # Remove duplicates based on place_id
    unique_places = {place['place_id']: place for place in all_places}.values()
    
    # Get details and sort by rating
    cafes = []
    for place in unique_places:
        cafe_details = gmaps.place(place['place_id'], fields=[
            'name', 'rating', 'formatted_address', 'photo', 'url', 'website', 'reviews'
        ])['result']
        
        # Only add places that have a rating
        if cafe_details.get('rating'):

            # Get Photo Reference and Photo URL
            photo_reference = cafe_details.get('photos', [{}])[0].get('photo_reference') if cafe_details.get('photos') else None
            photo_url = None
            if photo_reference:
                photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference={photo_reference}&key={api_key}"

            rev = cafe_details.get('reviews', [{}])[0].get('text') if cafe_details.get('reviews') else None

            cafe_data = {
                'name': cafe_details.get('name'),
                'rating': cafe_details.get('rating'),
                'address': cafe_details.get('formatted_address'),
                'photo_reference': photo_reference,
                'photo_url': photo_url,
                'web': cafe_details.get('website'),
                'googlemapsurl': cafe_details.get('url'),
                'rev': rev
            }
            cafes.append(cafe_data)
    
    # Sort by rating (highest first) and take top 5
    cafes.sort(key=lambda x: x['rating'], reverse=True)
    return cafes[:5]

if __name__ == "__main__":
    # Convert 3 miles to meters
    radius_in_meters = int(3 * 1609.34)

    # Call method
    test_cafes = fetch_cafes("San Jose, CA", radius_in_meters)

    # Print results
    print(f"\nTop 5 Cafes in San Jose, CA within 3 miles:")
    print("-" * 50)
    for cafe in test_cafes:
        print(f"Name: {cafe['name']}")
        print(f"Rating: {cafe['rating']}")
        print(f"Address: {cafe['address']}")
        print(f"Has Photo: {'Yes' if cafe['photo_reference'] else 'No'}")
        if cafe['photo_url']:
            print(f"Photo URL: {cafe['photo_url']}")
        print(f"Website: {cafe['web']}")
        print(f"GoogleMapsURL: {cafe['googlemapsurl']}")
        print(f"First Review: {cafe['rev']}")
        print("-" * 50)
