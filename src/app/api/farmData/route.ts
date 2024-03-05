import { NextResponse } from 'next/server';
import extractData from '../../../../lib/utils/extractFarmDataHelper';
export const revalidate = 600;
import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';


interface FarmOutput {
  totalOutput: number;
  weeklyOutputs: { week: number; value: number }[];
}

async function fetchWeeklyData(startWeek=0) {
  const maxTimeslotOffset = getWeeksSinceStart();
  
  const farmOutputs: Record<string, FarmOutput> = {};
  const baseUrl = process.env.DEVICE_STATS_URL || '';

  for (let i = startWeek; i <= maxTimeslotOffset; i++) {
    const timeSlotOffset = i * 2016;
    const url = baseUrl + timeSlotOffset;

    try {
        const response = await fetch(url);
        const data = await response.json();
        extractData(data, farmOutputs, i);

    } catch (error) {
        console.error('Error fetching data:', error);
        return;
    }
  }

  return farmOutputs;
}



export async function GET() {
  let weeklyFarmData;

  try {
    weeklyFarmData = await fetchWeeklyData(0);
  } catch (error) {
    console.error('Error fetching weekly farm data:', error);
  }

  return NextResponse.json(weeklyFarmData);
}

