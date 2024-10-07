import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';
import { NextResponse } from 'next/server';
import calculateWeeklyTokenRewards from '../../../../lib/utils/calculateWeeklyTokenRewards';
import calculateWeeklyCashRewards from '../../../../lib/utils/calculateWeeklyCashRewards';
import { IWeeklyDataByFarm } from '../../types';
export const revalidate = 7200;

interface Output {
  weeklyCarbonCredit: {week: number; value: number}[];
  weeklyFarmCount: {week: number; value: number}[];
  weeklyFarmIds: {week: number; value: number[]}[];
  weeklyTotalOutput: {week: number; value: number}[];
  weeklyDataByFarm: IWeeklyDataByFarm;
  weeklySolarPanelCount: {week: number; value: number}[];
}

const maxTimeslotOffset = getWeeksSinceStart();
const BASE_URL = process.env.FARM_STATS_URL || '';
const GCA_SERVER_URL = process.env.GCA_SERVER_URL || '';
const FARM_STATUS_URL = process.env.FARM_STATUS_URL || '';
const DEFAULT_BANNED_FARMS = [1, 5, 8, 6, 7, 11, 13];

const getRequestBody = (week: number) => ({
  urls: [GCA_SERVER_URL],
  week_number: week,
  with_full_data: false,
  include_unassigned_farms: false
});

interface FarmInfo {
  panelCount: number;
  farmName: string;
  [key: string]: any;
}

interface WeeklyFarmId {
  week: number;
  value: number[];
}

interface WeeklySolarCount {
  week: number;
  value: number;
}

async function getWeeklySolarPanelCount(weeklyFarmIds: WeeklyFarmId[]): Promise<WeeklySolarCount[]> {
  // Fetch allFarmsInfo from the API using fetch
  const response = await fetch('https://glowstats.xyz/api/allFarmsInfo');
  const data = await response.json();
  const allFarmsInfo: Record<string, FarmInfo> = data.allFarmsInfo;

  const weeklySolarCounts: WeeklySolarCount[] = [];

  for (const weekData of weeklyFarmIds) {
    let currWeekSolarCount = 0;
    const seen = new Set();

    for (const id of weekData.value) {
      if (id in allFarmsInfo && !seen.has(allFarmsInfo[id].farmName)) {
        currWeekSolarCount += allFarmsInfo[id].panelCount;
        seen.add(allFarmsInfo[id].farmName);
      } else {
        // If id is not found, check if it's part of the farmName
        const matchingFarm = Object.values(allFarmsInfo).find(farm => {
          return farm.farmName.includes(id.toString());
        }
        );
        if (matchingFarm && !seen.has(matchingFarm.farmName)) {
          currWeekSolarCount += matchingFarm.panelCount;
          seen.add(matchingFarm.farmName);
        }
      }
    }

    weeklySolarCounts.push({
      week: weekData.week,
      value: currWeekSolarCount
    });
  }

  return weeklySolarCounts;
}

const getBannedFarms = async (): Promise<number[]> => {
  try {
    const response = await fetch(FARM_STATUS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.legacy
      .filter((farm: { status: unknown }) => {
        return typeof farm.status === 'object' && 
               farm.status !== null && 
               'Banned' in farm.status;
      })
      .map((farm: { short_id: string }) => Number(farm.short_id));
  } catch (error) {
    console.error('Error fetching banned farms:', error);
    return DEFAULT_BANNED_FARMS;
  }
};

async function fetchWeekData(week: number, bannedFarmsSet: Set<number>) {
  const requestBody = getRequestBody(week);
  const response = await fetch(BASE_URL, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const farmData = data.filteredFarms;

  let carbonCredits = 0;
  let powerOutput = 0;
  let totalPayments = 0;
  let activeFarms = 0;
  let weeklyDataByFarm: IWeeklyDataByFarm = {};
  let currentFarmIds: number[] = [];

  for (let farm of farmData) {
    carbonCredits += farm.carbonCreditsProduced;
    powerOutput += farm.powerOutput;
    totalPayments += farm.weeklyPayment;

    const farmId = farm.shortId;

    if (bannedFarmsSet.has(farmId)) {
      continue;
    }

    activeFarms++;

    if (!weeklyDataByFarm[farmId]) {
      weeklyDataByFarm[farmId] = {
        powerOutputs: [],
        carbonCredits: [],
        weeklyPayments: [],
        weeklyTokenRewards: [],
        weeklyCashRewards: [],
      };
    }

    weeklyDataByFarm[farmId].powerOutputs.push({ week, value: farm.powerOutput });
    weeklyDataByFarm[farmId].carbonCredits.push({ week, value: farm.carbonCreditsProduced });
    weeklyDataByFarm[farmId].weeklyPayments.push({ week, value: farm.weeklyPayment });

    // if (week === maxTimeslotOffset) {
      currentFarmIds.push(farmId);
    // }
  }

  return {
    week,
    carbonCredits,
    powerOutput,
    activeFarms,
    weeklyDataByFarm,
    currentFarmIds,
  };
}

async function fetchWeeklyData(startWeek = 0) {
  const BANNED_FARMS = await getBannedFarms();
  const bannedFarmsSet = new Set(BANNED_FARMS);

  const weekPromises = [];
  for (let i = startWeek; i <= maxTimeslotOffset; i++) {
    weekPromises.push(fetchWeekData(i, bannedFarmsSet));
  }

  const weekResults = await Promise.all(weekPromises);

  const output: Output = {
    weeklyCarbonCredit: [],
    weeklyFarmCount: [],
    weeklyFarmIds: [],
    weeklyTotalOutput: [],
    weeklyDataByFarm: {} as IWeeklyDataByFarm,
    weeklySolarPanelCount: [],
    // currentFarmIds: [],
  };

  for (const result of weekResults) {
    output.weeklyCarbonCredit.push({ week: result.week, value: result.carbonCredits });
    output.weeklyFarmCount.push({ week: result.week, value: result.activeFarms });
    output.weeklyTotalOutput.push({ week: result.week, value: result.powerOutput });

    for (const [farmId, farmData] of Object.entries(result.weeklyDataByFarm)) {
      const id = Number(farmId);
      if (!output.weeklyDataByFarm[Number(id)]) {
        output.weeklyDataByFarm[id] = {
          powerOutputs: [],
          carbonCredits: [],
          weeklyPayments: [],
          weeklyTokenRewards: [],
          weeklyCashRewards: [],
        };
      }
      output.weeklyDataByFarm[id].powerOutputs.push(...farmData.powerOutputs);
      output.weeklyDataByFarm[id].carbonCredits.push(...farmData.carbonCredits);
      output.weeklyDataByFarm[id].weeklyPayments.push(...farmData.weeklyPayments);
    }

    // if (result.week === maxTimeslotOffset) {
      output.weeklyFarmIds.push({
        week: result.week,
        value: result.currentFarmIds
      });
    // }
  }

  const weeklyTokenRewards = calculateWeeklyTokenRewards(output.weeklyDataByFarm);
  const weeklyCashRewards = calculateWeeklyCashRewards(output.weeklyDataByFarm);

  for (let farmId in weeklyTokenRewards) {
    output.weeklyDataByFarm[farmId].weeklyTokenRewards = weeklyTokenRewards[farmId].weeklyTokenRewards;
    output.weeklyDataByFarm[farmId].weeklyCashRewards = weeklyCashRewards[farmId].weeklyCashRewards;
  }

  const weeklySolarPanelCount = await getWeeklySolarPanelCount(output.weeklyFarmIds);
  output.weeklySolarPanelCount = weeklySolarPanelCount;

  return output;
}

export async function GET() {
  try {
    const weeklyData = await fetchWeeklyData(0);
    return NextResponse.json(weeklyData);
  } catch (error) {
    console.error('Error fetching weekly farm data:', error);
    return NextResponse.json({ error: 'Error fetching weekly farm data' });
  }
}