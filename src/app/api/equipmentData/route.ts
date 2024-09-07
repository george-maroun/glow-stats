import { NextResponse } from 'next/server';
export const revalidate = 7200;

export async function GET() {
  try {
    const url = process.env.EQUIPMENT_STATS_URL || '';

    const equipmentData = await fetch(url);
    const equipmentJson = await equipmentData.json();

    if (!equipmentData.ok) {
      throw new Error(`Error fetching equipment data: ${equipmentData.statusText}`);
    }

    return NextResponse.json({ equipmentJson });
  } catch (error:any) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 500 }); // Return error response with status code 500
  }
}