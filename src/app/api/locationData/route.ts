import { NextResponse } from 'next/server';
export const revalidate = 3600;

type Param = number | string;

// Helper function to fetch location data
async function fetchLocationData(lat:Param, lon:Param) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json';
  const url = `${baseURL}?latlng=${lat},${lon}&key=${API_KEY}`;
  
  const locationData = await fetch(url);
  if (!locationData.ok) {
    throw new Error(`Error fetching location data: ${locationData.statusText}`);
  }
  return locationData.json();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      throw new Error('Missing latitude or longitude parameters');
    }

    const locationJson = await fetchLocationData(lat, lon);

    return NextResponse.json({ locationJson });
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 500 }); // Return error response with status code 500
  }
}
