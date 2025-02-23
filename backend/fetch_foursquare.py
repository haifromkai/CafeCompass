# Script to fetch cafe details from Foursquare Places API

import requests
import os
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), ".env.backend")
load_dotenv(env_path)

API_KEY = os.getenv("FOURSQUARE_API_KEY")
URL = "https://api.foursquare.com/v3/places/search"

def get_cafes(city: str, limit: int = 5):
    """
    Fetches cafes from Foursquare API based on given params
    :param city: City name and state abbreviation (e.g., "San Jose, CA")
    :param limit: Number of results (default 5)
    :return: List of café data
    """
    if not API_KEY:
        raise ValueError("Missing Foursquare API Key. Set FOURSQUARE_API_KEY in .env.backend.")

    headers = {
        "accept": "application/json",
        "Authorization": API_KEY
    }

    params = {
        "query": "cafe coffee tea",
        "limit": limit,
        "sort": "DISTANCE",
        "near": city
    }

    response = requests.get(URL, headers=headers, params=params)

    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        print("Error:", response.status_code, response.json())
        return []



# Test usage:
if __name__ == "__main__":

    # get list of 10 cafes
    cafes = get_cafes("San Jose, CA", 10)

     # show all results
    for cafe in cafes:

        # convert and round distance (meters to miles)
        dist = round(cafe['distance'] / 1609.344, 2)

        # extract icon URL from category array
        categories = cafe.get('categories', [])

        if (categories):
            icon_prefix = categories[0]['icon']['prefix']
            icon_suffix = categories[0]['icon']['suffix']
            icon_url = f"{icon_prefix}bg_64{icon_suffix}"   # 64px icon size
        else:
            icon_url = "No icon available"


        # print out details
        print(f"{cafe['name']} - {cafe['location']['formatted_address']} - {dist} miles - icon: {icon_url}")


