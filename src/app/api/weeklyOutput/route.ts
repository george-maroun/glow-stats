import { NextResponse } from 'next/server';
import getTotalOutput from '../../../../lib/utils/getTotalOutputHelper';
import fetchWeeklyOutput from '../../../../lib/utils/fetchDataHelper';
export const revalidate = 600;

export async function GET() {
  let weeklyOutputData; 
  try {
    weeklyOutputData = await fetchWeeklyOutput(0, getTotalOutput);
  } catch (error) {
    console.error('Error fetching weekly output data:', error);
  }
  return NextResponse.json(weeklyOutputData);
}