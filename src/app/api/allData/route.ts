import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';
import { NextResponse } from 'next/server';
import calculateWeeklyTokenRewards from '../../../../lib/utils/calculateWeeklyTokenRewards';
export const revalidate = 60;

interface WeeklyDataByFarm {
  [key: number]: {
    powerOutputs: { week: number; value: number }[];
    carbonCredits: { week: number; value: number }[];
    weeklyPayments: { week: number; value: number }[];
  }
}

interface Output {
  weeklyCarbonCredit: {week: number; value: number}[];
  weeklyFarmCount: {week: number; value: number}[];
  weeklyTotalOutput: {week: number; value: number}[]
  weeklyDataByFarm: any;
  currentFarmIds: number[];
}

async function fetchWeeklyData(startWeek = 0) {
  const output: Output = {
    weeklyCarbonCredit: [],
    weeklyFarmCount: [],
    weeklyTotalOutput: [],
    weeklyDataByFarm: {},
    currentFarmIds: [],
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
            weeklyPayments: []
          };
        }

        output.weeklyDataByFarm[farmId].powerOutputs.push({ week: i, value: farm.powerOutput });
        output.weeklyDataByFarm[farmId].carbonCredits.push({ week: i, value: farm.carbonCreditsProduced });
        output.weeklyDataByFarm[farmId].weeklyPayments.push({ week: i, value: farm.weeklyPayment });
      }

      output.weeklyCarbonCredit.push({ week: i, value: carbonCredits });
      output.weeklyFarmCount.push({ week: i, value: activeFarms });
      output.weeklyTotalOutput.push({ week: i, value: powerOutput });
      

    } catch (error) {
      console.error(`Error fetching data for week ${i}:`, error);
      // Continue processing the next weeks even if one week fails
    }
  }

  // Get weekly token rewards
  const weeklyTokenRewards = calculateWeeklyTokenRewards(output.weeklyDataByFarm);

  for (let farmId in weeklyTokenRewards) {
    output.weeklyDataByFarm[farmId].weeklyTokenRewards = weeklyTokenRewards[farmId].weeklyTokenRewards;
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
