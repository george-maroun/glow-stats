import { NextResponse } from 'next/server';
export const revalidate = 7200;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      throw new Error('Missing latitude or longitude parameters');
    }

    const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    const weatherData = await fetch(url);
    const weatherJson = await weatherData.json();

    if (!weatherData.ok) {
      throw new Error(`Error fetching weather data: ${weatherData.statusText}`);
    }

    return NextResponse.json({ weatherJson });
  } catch (error:any) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 500 }); // Return error response with status code 500
  }
}