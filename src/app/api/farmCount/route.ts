import { NextResponse } from 'next/server';
import fetchWeeklyData from '../../../../lib/utils/fetchDataHelper';
export const revalidate = 600;


const getDeviceCount = (data:any) => {
  return data.Devices.length;
}

export async function GET() {
  let weeklyFarmCountData; 
  try {
    weeklyFarmCountData = await fetchWeeklyData(0, getDeviceCount);
  } catch (error) {
    console.error('Error fetching weekly farm count data:', error);
  }
  return NextResponse.json(weeklyFarmCountData);
}