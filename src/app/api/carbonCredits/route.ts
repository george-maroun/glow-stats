import { NextResponse } from "next/server";
import getWeeksSinceStart from "../../../../lib/utils/currentWeekHelper";
import { byteArrToStr } from "../../../../lib/utils/byteArrayHelpers";

export const revalidate = 60;

type Device = {
  PublicKey: number[];
  PowerOutputs: number[];
  ImpactRates: number[];
};

const BASE_URL = process.env.DEVICE_STATS_URL;
const TIMESLOT_MULTIPLIER = 2016;
const CONVERSION_FACTOR = 0.65;
const POWER_TO_CREDITS_DIVISOR = 10 ** 15;

async function fetchWeekData(weekOffset: number) {
  const url = `${BASE_URL}${weekOffset * TIMESLOT_MULTIPLIER}`;
  const response = await fetch(url);
  return response.json();
}

function calculateCarbonCreditsForDevice(device: Device) {
  const publicKey = byteArrToStr(device.PublicKey);
  const totalCarbonCredits = device.PowerOutputs.reduce((total, output, index) => 
    total + output * device.ImpactRates[index], 0);
  return { [publicKey]: totalCarbonCredits / POWER_TO_CREDITS_DIVISOR * CONVERSION_FACTOR };
}

async function fetchRealTimeCarbonCreditData(startWeek = 0) {
  const maxTimeslotOffset = getWeeksSinceStart();
  const fetchPromises = [];

  for (let i = startWeek; i <= maxTimeslotOffset; i++) {
    fetchPromises.push(fetchWeekData(i));
  }

  const weeklyData = await Promise.all(fetchPromises).then(results =>
    results.map((data, index) => ({
      week: startWeek + index,
      values: data.Devices.reduce((acc:any, device:Device) => ({
        ...acc,
        ...calculateCarbonCreditsForDevice(device)
      }), {})
    }))
  ).catch(error => {
    console.error('Error fetching data:', error);
    throw error; // Rethrow or handle as needed
  });

  return weeklyData;
}

export async function GET() {
  const perFarmData = await fetchRealTimeCarbonCreditData();
  const aggregatedData = perFarmData.map(({ week, values }) => ({
    week,
    value: Object.values(values).reduce((acc:any, curr) => acc + curr, 0)
  }));

  const GCCSupply = aggregatedData.reduce((acc:any, curr) => acc + curr.value, 0).toFixed(3);

  return NextResponse.json({
    weeklyCarbonCreditsPerFarm: perFarmData,
    weeklyCarbonCredits: aggregatedData,
    GCCSupply
  });
}
