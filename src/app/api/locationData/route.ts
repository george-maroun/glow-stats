// Test route to check if data caching is working
import { NextResponse } from 'next/server';
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      throw new Error('Missing latitude or longitude parameters');
    }

    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json';


    const url = `${baseURL}?latlng=${lat},${lon}&key=${API_KEY}`;

    const locationData = await fetch(url);
    const locationJson = await locationData.json();

    if (!locationData.ok) {
      throw new Error(`Error fetching weather data: ${locationData.statusText}`);
    }

    return NextResponse.json({ locationJson });
  } catch (error:any) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 500 }); // Return error response with status code 500
  }
}