// Test route to check if data caching is working
import { NextResponse } from 'next/server';
export const revalidate = 120;

export async function GET() {
  try {
    const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/ethereum/0xeed0974404f635aa5e5f6e4793d1a417798f164e");
    const data = await res.json();
    const gccPrice = data.pairs[0].priceNative;
    return NextResponse.json({gccPrice: gccPrice});
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return NextResponse.json({gccPrice: undefined});
}