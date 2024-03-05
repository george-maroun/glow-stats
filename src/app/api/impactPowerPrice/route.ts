// Test route to check if data caching is working
import { NextResponse } from 'next/server';
export const revalidate = 120;

const GLOW_GREEN_API = process.env.GLOW_GREEN_API || '';

export async function GET() {
  try {
    const res = await fetch(GLOW_GREEN_API);
    const data = await res.json();
    return NextResponse.json({impactPowerPrice: Math.round(Number(data.estimate.amountUSDCNeededNumber))});
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return NextResponse.json({impactPowerPrice: undefined});
}