import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';
import { NextResponse } from 'next/server';
export const revalidate = 60;

interface WeeklyDataByFarm {
  [key: number]: {
    powerOutputs: { week: number; value: number }[];
    carbonCredits: { week: number; value: number }[];
  }
}

interface Output {
  weeklyCarbonCredit: {week: number; value: number}[];
  weeklyFarmCount: {week: number; value: number}[];
  weeklyTotalOutput: {week: number; value: number}[]
  weeklyDataByFarm: WeeklyDataByFarm;
  currentFarmIds: number[];
  weeklyPayments: {week: number; value: number}[];
}

async function fetchWeeklyData(startWeek = 0) {
  const output: Output = {
    weeklyCarbonCredit: [],
    weeklyFarmCount: [],
    weeklyTotalOutput: [],
    weeklyDataByFarm: {},
    currentFarmIds: [],
    weeklyPayments: []
  };

  const maxTimeslotOffset = getWeeksSinceStart();
  const BASE_URL = process.env.FARM_STATS_URL || '';
  const GCA_SERVER_URL = process.env.GCA_SERVER_URL || '';

  for (let i = startWeek; i <= maxTimeslotOffset; i++) {
    const requestBody = {
      urls: [GCA_SERVER_URL],
      week_number: i,
      with_full_data: true,
      include_unassigned_farms: false
    };

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const activeFarms = data.numActiveFarms;
      const farmData = data.filteredFarms;

      if (i === maxTimeslotOffset) {
        output.currentFarmIds = farmData.map((farm: any) => farm.shortId);
      }

      let carbonCredits = 0;
      let powerOutput = 0;
      let totalPayments = 0;

      for (let farm of farmData) {
        carbonCredits += farm.carbonCreditsProduced;
        powerOutput += farm.powerOutput;
        totalPayments += farm.weeklyPayment;

        const farmId = farm.shortId;
        if (!output.weeklyDataByFarm[farmId]) {
          output.weeklyDataByFarm[farmId] = {
            powerOutputs: [],
            carbonCredits: [],
          };
        }
        output.weeklyDataByFarm[farmId].powerOutputs.push({ week: i, value: farm.powerOutput });
        output.weeklyDataByFarm[farmId].carbonCredits.push({ week: i, value: farm.carbonCreditsProduced });
      }

      output.weeklyCarbonCredit.push({ week: i, value: carbonCredits });
      output.weeklyFarmCount.push({ week: i, value: activeFarms });
      output.weeklyTotalOutput.push({ week: i, value: powerOutput });
      output.weeklyPayments.push({ week: i, value: totalPayments });

    } catch (error) {
      console.error(`Error fetching data for week ${i}:`, error);
      // Continue processing the next weeks even if one week fails
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
    return NextResponse.json({ error: 'Error fetching weekly farm data' });
  }
  return NextResponse.json(weeklyData);
}