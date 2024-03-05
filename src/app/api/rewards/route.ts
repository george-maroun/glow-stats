// Test route to check if data caching is working
import { NextResponse } from 'next/server';
export const revalidate = 1000;

import { createPublicClient, http } from 'viem';
import { mainnet } from '@wagmi/core/chains'
import {
  getWeeklyRewardsForWeeksMulticall,
} from '../../../../multicalls/view/getWeeklyRewardsForWeeksMulticall';
import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';

const getRewards = async () => {
  const transport = http(process.env.INFURA_URL!)
  const viemClient = createPublicClient({
    transport: transport,
    chain: mainnet, //need mainnet import for the multicall
  })

  const currentWeek = getWeeksSinceStart()
  const lastWeekToFetch = currentWeek + 208
  const rewards = await getWeeklyRewardsForWeeksMulticall({
    client: viemClient,
    weekStart: currentWeek,
    weekEnd: lastWeekToFetch,
  })
  return { rewards }
}

export async function GET() {
  const rewards = await getRewards();
  try {
    return NextResponse.json(rewards);
  }
  catch (error) {
    console.error('Error fetching data:', error);

  }
  return NextResponse.json({ rewards: undefined });
}