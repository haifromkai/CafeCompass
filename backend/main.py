# Creating an API Endpoint using FastAPI to connect frontend with fetch_google.py backend script

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fetch_google import fetch_cafes

app = FastAPI()

# Configure CORS to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Convert landing page's radius from mile to meters (to be used in Google API)
def miles_to_meters(miles: float) -> int:
    return int(miles * 1609.34)

@app.get("/api/cafes")
async def get_cafes(selectedPlace: str, radius: float):
    try:
        # Convert radius from miles to meters
        radius_meters = miles_to_meters(float(radius))
        cafes = fetch_cafes(selectedPlace, radius_meters)
        return {"cafes": cafes}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
