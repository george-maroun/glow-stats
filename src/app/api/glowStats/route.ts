import { NextResponse } from 'next/server';
export const revalidate = 0;

const GLOW_GREEN_API_BASE = process.env.GLOW_GREEN_API || '';
const GLOW_GREEN_API = `${GLOW_GREEN_API_BASE}headline-stats`;

interface GlowStats {
  glowPrice: number;
  circulatingSupply: number;
  totalSupply: number;
  marketCap: number;
  allProtocolFees: {
    revenueToken: string;
    revenueUSD: string;
    date: number;
  }[];
}

async function getGlowStats() {
  try {
    const response = await fetch(GLOW_GREEN_API);
    if (!response.ok) throw new Error('Network response was not ok');
    const glowStats: GlowStats = await response.json();

    return {
      price: glowStats.glowPrice,
      circulatingSupply: glowStats.circulatingSupply,
      totalSupply: glowStats.totalSupply,
      marketCap: glowStats.marketCap,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return undefined;
  }
}

export async function GET() {
  const glowStats = await getGlowStats(); 

  if (!glowStats) {
    return NextResponse.error();
  }

  return NextResponse.json(glowStats);
}
