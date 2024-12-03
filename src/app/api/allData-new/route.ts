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
  // weeklyFarmNames: {week: number; value: string[]}[];
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

interface WeeklyFarmName {
  week: number;
  value: string[];
}

interface WeeklySolarCount {
  week: number;
  value: number;
}

async function getWeeklySolarPanelCount(auditData: any, weeklyFarmIds: WeeklyFarmId[]): Promise<WeeklySolarCount[]> {
  // Fetch allFarmsInfo from the API using fetch
  

  const weeklySolarCounts: WeeklySolarCount[] = [];

  for (const weekData of weeklyFarmIds) {
    let currWeekSolarCount = 0;
    const ids = new Set<number>(weekData.value);

    for (const farm of auditData) {
      const shortIds = farm.activeShortIds;
      // Check if any of the farm's shortIds are in the ids set
      if (shortIds.some((id: number) => ids.has(id))) {
        currWeekSolarCount += farm.summary.solarPanels.quantity;
        // Skip remaining IDs for this farm
        continue;
      }
    }

    weeklySolarCounts.push({
      week: weekData.week,
      value: currWeekSolarCount
    });
  }

  return weeklySolarCounts;
}

function getFarmNameIdMap(auditData: any): Record<number, string> {
  const idFarmNameMap: Record<number, string> = {};
  for (const farm of auditData) {
    for (const shortId of farm.activeShortIds) {
      idFarmNameMap[shortId] = farm.farmName;
    }
  }
  return idFarmNameMap;
}

async function getWeeklyFarmNames(auditData: any, weeklyFarmIds: WeeklyFarmId[]): Promise<WeeklyFarmName[]> {
  const farmNameIdMap = getFarmNameIdMap(auditData);
  const weeklyFarmNames: WeeklyFarmName[] = [];
  let counter = 1;
  for (const weekData of weeklyFarmIds) {
    const farmNames = new Set<string>();
    for (const id of weekData.value) {
      if (farmNameIdMap.hasOwnProperty(id)) {
        farmNames.add(farmNameIdMap[id]);
      }
    }
    weeklyFarmNames.push({ week: weekData.week, value: Array.from(farmNames) });
    counter++;
  }
  return weeklyFarmNames;
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
  // let activeFarms = 0;
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

    // activeFarms++;

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

    currentFarmIds.push(farmId);
    if (farm.status.hasOwnProperty("AuditInherited") && farm.status.AuditInherited.hasOwnProperty("oldFarmId")) {
      currentFarmIds.push(farm.status.AuditInherited.oldFarmId);
    }
  }

  return {
    week,
    carbonCredits,
    powerOutput,
    // activeFarms,
    weeklyDataByFarm,
    currentFarmIds,
  };
}

async function fetchWeeklyData(startWeek = 0) {
  const response = await fetch('https://glow.org/api/audits');
  const auditData = await response.json();

  // for each farm in auditData, create a mapping of farm.farmName to farm.activeShortIds
  const farmNameIdMap: Record<string, number[]> = {};
  for (const farm of auditData) {
    if (farm.activeShortIds[2] == 490) {
      farmNameIdMap[farm.activeShortIds[2]] = farm.activeShortIds;
    } else {
      farmNameIdMap[farm.activeShortIds[0]] = farm.activeShortIds;
    }
  }


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
    // weeklyFarmNames: [],
    // currentFarmIds: [],
  };

  function combineDataByFarmName(weeklyDataById: IWeeklyDataByFarm, farmNameIdMap: Record<string, number[]>): IWeeklyDataByFarm {
    const weeklyDataByFarm: IWeeklyDataByFarm = {};
    
    // Create reverse mapping from ID to farm name
    const idToFarmName: Record<number, string> = {};
    for (const [primaryId, ids] of Object.entries(farmNameIdMap)) {
      for (const id of ids) {
        idToFarmName[id] = primaryId;
      }
    }

    // Combine data for each week
    for (const [id, data] of Object.entries(weeklyDataById)) {
      const farmId = idToFarmName[Number(id)];
      if (!farmId) continue;

      const numFarmId = Number(farmId);
      if (!weeklyDataByFarm[numFarmId]) {
        weeklyDataByFarm[numFarmId] = {
          powerOutputs: [],    // Use arrays to match the interface
          carbonCredits: [],
          weeklyPayments: [],
          weeklyTokenRewards: [],
          weeklyCashRewards: [],
        };
      }

      // Combine all data types in a single pass
      for (const weekData of data.powerOutputs) {
        const existingEntry = weeklyDataByFarm[numFarmId].powerOutputs.find(entry => entry.week === weekData.week);
        if (existingEntry) {
          existingEntry.value += weekData.value;
        } else {
          weeklyDataByFarm[numFarmId].powerOutputs.push({ week: weekData.week, value: weekData.value });
        }
      }

      for (const weekData of data.carbonCredits) {
        const existingEntry = weeklyDataByFarm[numFarmId].carbonCredits.find(entry => entry.week === weekData.week);
        if (existingEntry) {
          existingEntry.value += weekData.value;
        } else {
          weeklyDataByFarm[numFarmId].carbonCredits.push({ week: weekData.week, value: weekData.value });
        }
      }

      for (const weekData of data.weeklyPayments) {
        const existingEntry = weeklyDataByFarm[numFarmId].weeklyPayments.find(entry => entry.week === weekData.week);
        if (existingEntry) {
          existingEntry.value += weekData.value;
        } else {
          weeklyDataByFarm[numFarmId].weeklyPayments.push({ week: weekData.week, value: weekData.value });
        }
      }
    }

    return weeklyDataByFarm;
  }

  // Replace the existing data aggregation with the new combined data
  for (const result of weekResults) {
    output.weeklyCarbonCredit.push({ week: result.week, value: result.carbonCredits });
    output.weeklyTotalOutput.push({ week: result.week, value: result.powerOutput });
    
    // Combine data by farm name instead of by ID
    const combinedDataByFarmName = combineDataByFarmName(result.weeklyDataByFarm, farmNameIdMap);
    // output.weeklyDataByFarm[id].combinedDataByFarmName;

    for (const [farmId, farmData] of Object.entries(combinedDataByFarmName)) {
      const id = Number(farmId);
      if (!output.weeklyDataByFarm[Number(id)]) {
        output.weeklyDataByFarm[Number(id)] = {
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
    
    output.weeklyFarmIds.push({
      week: result.week,
      value: result.currentFarmIds
    });
  }

  // sum all the values for powerOutputs for each value output.weeklyDataByFarm and console.log it
  // let totalPowerOutput = 0;
  // for (const farmId in output.weeklyDataByFarm) {
  //   totalPowerOutput += output.weeklyDataByFarm[farmId].powerOutputs.reduce((acc, curr) => acc + curr.value, 0);
  // }
  // console.log(totalPowerOutput);

  const weeklyTokenRewards = calculateWeeklyTokenRewards(output.weeklyDataByFarm);
  const weeklyCashRewards = calculateWeeklyCashRewards(output.weeklyDataByFarm);

  for (let farmId in weeklyTokenRewards) {
    output.weeklyDataByFarm[farmId].weeklyTokenRewards = weeklyTokenRewards[farmId].weeklyTokenRewards;
    output.weeklyDataByFarm[farmId].weeklyCashRewards = weeklyCashRewards[farmId].weeklyCashRewards;
  }



  const weeklySolarPanelCount = await getWeeklySolarPanelCount(auditData, output.weeklyFarmIds);
  const weeklyFarmNames = await getWeeklyFarmNames(auditData, output.weeklyFarmIds);

  output.weeklySolarPanelCount = weeklySolarPanelCount;
  // output.weeklyFarmNames = weeklyFarmNames;
  for (const week of weeklyFarmNames) {
    output.weeklyFarmCount.push({ week: week.week, value: week.value.length });
  }

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

