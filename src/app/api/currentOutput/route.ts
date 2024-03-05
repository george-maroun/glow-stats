import fetchWeeklyData from "../../../../lib/utils/fetchDataHelper";
import getTotalOutput from "../../../../lib/utils/getTotalOutputHelper";
import getWeeksSinceStart from "../../../../lib/utils/currentWeekHelper";
import { NextResponse } from 'next/server';
export const revalidate = 60;

export async function GET() {
  const currWeek = getWeeksSinceStart();
  const currWeekOutput = await fetchWeeklyData(currWeek, getTotalOutput);

  return NextResponse.json(currWeekOutput);
}