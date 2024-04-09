import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';
import { NextResponse } from 'next/server';
export const revalidate = 600;

// TODO
// interface FarmData {

// }

interface Output {
  weeklyCarbonCredit: {week: number; value: number}[];
  weeklyFarmCount: {week: number; value: number}[];
  weeklyTotalOutput: {week: number; value: number}[]
  // weeklyDataByFarm: { week: number; value: number }[];
}

// TODO: Extract more info from this URL

async function fetchWeeklyData(startWeek=0) {
  const output: Output = {
    weeklyCarbonCredit: [],
    weeklyFarmCount: [],
    weeklyTotalOutput: [],
  };

  const maxTimeslotOffset = getWeeksSinceStart();

  const BASE_URL = process.env.FARM_STATS_URL || '';
  const GCA_SERVER_URL = process.env.GCA_SERVER_URL || '';

  let farmsHex = new Set();

  for (let i = startWeek; i <= maxTimeslotOffset; i ++) {

    const requestBody = {
      urls: [GCA_SERVER_URL], // the GCA server URLs to query
      week_number: i, // week number you're claiming for
      with_full_data: true, // returns a list of the filtered farms and their credit production
      include_unassigned_farms: false // if true, response returns farms that have paid protocol fees that aren't online yet
    };

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST', // Specify the method
        headers: {
            'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify(requestBody) // Convert the JavaScript object to a JSON string
      })
      const data = await response.json();
      const farmData = data.filteredFarms;

      let carbonCredits = 0;
      let powerOutput = 0;
      

      for (let farm of farmData) {
        carbonCredits += farm.carbonCreditsProduced;
        powerOutput += farm.powerOutput;
        farmsHex.add(farm.hexlifiedPublicKey);
      }

      output.weeklyCarbonCredit.push({ week: i, value: carbonCredits });
      output.weeklyFarmCount.push({ week: i, value: farmsHex.size });
      output.weeklyTotalOutput.push({ week: i, value: powerOutput });

    } catch (error) {
        console.error('Error fetching data:', error);
        return;
    }
  }

  return output;
}


export async function GET() {
  let weeklyData;
  try {
    weeklyData = await fetchWeeklyData(0);
  } catch (error) {
    console.error('Error fetching weekly farm data:', error);
  }
  return NextResponse.json(weeklyData);
}