import { NextResponse } from 'next/server';
export const revalidate = 6000;

const GLOW_GREEN_API = process.env.GLOW_GREEN_API || '';
const GLOW_PRICE_API = `${GLOW_GREEN_API}all-glow-prices`;

interface PriceData {
  date: number;
  price: string;
}

async function getGlowDailyPrice() {
  try {
    const response = await fetch(GLOW_PRICE_API);
    if (!response.ok) throw new Error('Network response was not ok');
    const glowDailyPrice: PriceData[] = await response.json();

    return {
      glowDailyPrice,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return undefined;
  }
}

export async function GET() {
  const glowDailyPrice = await getGlowDailyPrice(); 

  if (!glowDailyPrice) {
    return NextResponse.error();
  }

  return NextResponse.json(glowDailyPrice);
}

