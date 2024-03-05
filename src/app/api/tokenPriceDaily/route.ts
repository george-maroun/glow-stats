import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
export const revalidate = 600;

const fetchTokenPrice = async () => {
  const priceUniswapDaily = await prisma.priceUniswap.findMany({
    orderBy: {
      date: 'asc',
    },
  });
  const priceContractDaily = await prisma.priceContract.findMany({
    orderBy: {
      date: 'asc', 
    },
  });
  return { priceUniswapDaily, priceContractDaily };
}

export async function GET() {
  let tokenPriceData;
  try {
    tokenPriceData = await fetchTokenPrice();
  }
  catch (error) {
    console.error('Error fetching token price data:', error);
  }
  return NextResponse.json(tokenPriceData);
}