// import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';
// import { NextResponse } from 'next/server';
// import calculateWeeklyTokenRewards from '../../../../lib/utils/calculateWeeklyTokenRewards';
// import calculateWeeklyCashRewards from '../../../../lib/utils/calculateWeeklyCashRewards';
// import { IWeeklyDataByFarm } from '../../types';
// export const revalidate = 0;

// interface Output {
//   weeklyCarbonCredit: {week: number; value: number}[];
//   weeklyFarmCount: {week: number; value: number}[];
//   weeklyFarmIds: {week: number; value: number[]}[];
//   weeklyTotalOutput: {week: number; value: number}[];
//   weeklyDataByFarm: IWeeklyDataByFarm;
//   weeklySolarPanelCount: {week: number; value: number}[];
//   // weeklyFarmNames: {week: number; value: string[]}[];
// }

// const maxTimeslotOffset = getWeeksSinceStart();
// const BASE_URL = process.env.FARM_STATS_URL || '';
// const GCA_SERVER_URL = process.env.GCA_SERVER_URL || '';
// const FARM_STATUS_URL = process.env.FARM_STATUS_URL || '';
// const DEFAULT_BANNED_FARMS = [1, 5, 8, 6, 7, 11, 13];

// const getRequestBody = (week: number) => ({
//   urls: [GCA_SERVER_URL],
//   week_number: week,
//   with_full_data: false,
//   include_unassigned_farms: false
// });

// interface FarmInfo {
//   panelCount: number;
//   farmName: string;
//   [key: string]: any;
// }

// interface WeeklyFarmId {
//   week: number;
//   value: number[];
// }

// interface WeeklyFarmName {
//   week: number;
//   value: string[];
// }

// interface WeeklySolarCount {
//   week: number;
//   value: number;
// }

// async function getWeeklySolarPanelCount(auditData: any, weeklyFarmIds: WeeklyFarmId[]): Promise<WeeklySolarCount[]> {
//   // Fetch allFarmsInfo from the API using fetch
  

//   const weeklySolarCounts: WeeklySolarCount[] = [];

//   for (const weekData of weeklyFarmIds) {
//     let currWeekSolarCount = 0;
//     const ids = new Set<number>(weekData.value);

//     for (const farm of auditData) {
//       const shortIds = farm.activeShortIds;
//       // Check if any of the farm's shortIds are in the ids set
//       if (shortIds.some((id: number) => ids.has(id))) {
//         currWeekSolarCount += farm.summary.solarPanels.quantity;
//         // Skip remaining IDs for this farm
//         continue;
//       }
//     }

//     weeklySolarCounts.push({
//       week: weekData.week,
//       value: currWeekSolarCount
//     });
//   }

//   return weeklySolarCounts;
// }

// function getFarmNameIdMap(auditData: any): Record<number, string> {
//   const idFarmNameMap: Record<number, string> = {};
//   for (const farm of auditData) {
//     for (const shortId of farm.activeShortIds) {
//       idFarmNameMap[shortId] = farm.farmName;
//     }
//   }
//   return idFarmNameMap;
// }

// async function getWeeklyFarmNames(auditData: any, weeklyFarmIds: WeeklyFarmId[]): Promise<WeeklyFarmName[]> {
//   const farmNameIdMap = getFarmNameIdMap(auditData);
//   const weeklyFarmNames: WeeklyFarmName[] = [];
//   let counter = 1;
//   for (const weekData of weeklyFarmIds) {
//     const farmNames = new Set<string>();
//     for (const id of weekData.value) {
//       if (farmNameIdMap.hasOwnProperty(id)) {
//         farmNames.add(farmNameIdMap[id]);
//       }
//     }
//     weeklyFarmNames.push({ week: weekData.week, value: Array.from(farmNames) });
//     counter++;
//   }
//   return weeklyFarmNames;
// }

// const getBannedFarms = async (): Promise<number[]> => {
//   try {
//     const response = await fetch(FARM_STATUS_URL);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data.legacy
//       .filter((farm: { status: unknown }) => {
//         return typeof farm.status === 'object' && 
//                farm.status !== null && 
//                'Banned' in farm.status;
//       })
//       .map((farm: { short_id: string }) => Number(farm.short_id));
//   } catch (error) {
//     console.error('Error fetching banned farms:', error);
//     return DEFAULT_BANNED_FARMS;
//   }
// };

// async function fetchWeekData(week: number, bannedFarmsSet: Set<number>) {
//   const requestBody = getRequestBody(week);
//   const response = await fetch(BASE_URL, {
//     method: 'POST', 
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(requestBody),
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   const data = await response.json();
//   const farmData = data.filteredFarms;

//   let carbonCredits = 0;
//   let powerOutput = 0;
//   let totalPayments = 0;
//   // let activeFarms = 0;
//   let weeklyDataByFarm: IWeeklyDataByFarm = {};
//   let currentFarmIds: number[] = [];

//   for (let farm of farmData) {
//     carbonCredits += farm.carbonCreditsProduced;
//     powerOutput += farm.powerOutput;
//     totalPayments += farm.weeklyPayment;

//     const farmId = farm.shortId;

//     if (bannedFarmsSet.has(farmId)) {
//       continue;
//     }

//     // activeFarms++;

//     if (!weeklyDataByFarm[farmId]) {
//       weeklyDataByFarm[farmId] = {
//         powerOutputs: [],
//         carbonCredits: [],
//         weeklyPayments: [],
//         weeklyTokenRewards: [],
//         weeklyCashRewards: [],
//       };
//     }

//     weeklyDataByFarm[farmId].powerOutputs.push({ week, value: farm.powerOutput });
//     weeklyDataByFarm[farmId].carbonCredits.push({ week, value: farm.carbonCreditsProduced });
//     weeklyDataByFarm[farmId].weeklyPayments.push({ week, value: farm.weeklyPayment });

//     currentFarmIds.push(farmId);
//     if (farm.status.hasOwnProperty("AuditInherited") && farm.status.AuditInherited.hasOwnProperty("oldFarmId")) {
//       currentFarmIds.push(farm.status.AuditInherited.oldFarmId);
//     }
//   }

//   return {
//     week,
//     carbonCredits,
//     powerOutput,
//     // activeFarms,
//     weeklyDataByFarm,
//     currentFarmIds,
//   };
// }

// async function fetchWeeklyData(startWeek = 0) {
//   const response = await fetch('https://glow.org/api/audits');
//   const auditData = await response.json();

//   // for each farm in auditData, create a mapping of farm.farmName to farm.activeShortIds
//   const farmNameIdMap: Record<string, number[]> = {};
//   for (const farm of auditData) {
//     farmNameIdMap[farm.activeShortIds[0]] = farm.activeShortIds;
//   }


//   const BANNED_FARMS = await getBannedFarms();
//   const bannedFarmsSet = new Set(BANNED_FARMS);

//   const weekPromises = [];
//   for (let i = startWeek; i <= maxTimeslotOffset; i++) {
//     weekPromises.push(fetchWeekData(i, bannedFarmsSet));
//   }

//   const weekResults = await Promise.all(weekPromises);

//   const output: Output = {
//     weeklyCarbonCredit: [],
//     weeklyFarmCount: [],
//     weeklyFarmIds: [],
//     weeklyTotalOutput: [],
//     weeklyDataByFarm: {} as IWeeklyDataByFarm,
//     weeklySolarPanelCount: [],
//     // weeklyFarmNames: [],
//     // currentFarmIds: [],
//   };

//   for (const result of weekResults) {
//     output.weeklyCarbonCredit.push({ week: result.week, value: result.carbonCredits });
//     // output.weeklyFarmCount.push({ week: result.week, value: result.activeFarms });
//     output.weeklyTotalOutput.push({ week: result.week, value: result.powerOutput });

//     for (const [farmId, farmData] of Object.entries(result.weeklyDataByFarm)) {
//       const id = Number(farmId);
//       if (!output.weeklyDataByFarm[Number(id)]) {
//         output.weeklyDataByFarm[id] = {
//           powerOutputs: [],
//           carbonCredits: [],
//           weeklyPayments: [],
//           weeklyTokenRewards: [],
//           weeklyCashRewards: [],
//         };
//       }
//       output.weeklyDataByFarm[id].powerOutputs.push(...farmData.powerOutputs);
//       output.weeklyDataByFarm[id].carbonCredits.push(...farmData.carbonCredits);
//       output.weeklyDataByFarm[id].weeklyPayments.push(...farmData.weeklyPayments);
//     }
//     output.weeklyFarmIds.push({
//       week: result.week,
//       value: result.currentFarmIds
//     });
//   }

//   const weeklyTokenRewards = calculateWeeklyTokenRewards(output.weeklyDataByFarm);
//   const weeklyCashRewards = calculateWeeklyCashRewards(output.weeklyDataByFarm);

//   for (let farmId in weeklyTokenRewards) {
//     output.weeklyDataByFarm[farmId].weeklyTokenRewards = weeklyTokenRewards[farmId].weeklyTokenRewards;
//     output.weeklyDataByFarm[farmId].weeklyCashRewards = weeklyCashRewards[farmId].weeklyCashRewards;
//   }



//   const weeklySolarPanelCount = await getWeeklySolarPanelCount(auditData, output.weeklyFarmIds);
//   const weeklyFarmNames = await getWeeklyFarmNames(auditData, output.weeklyFarmIds);

//   output.weeklySolarPanelCount = weeklySolarPanelCount;
//   // output.weeklyFarmNames = weeklyFarmNames;
//   for (const week of weeklyFarmNames) {
//     output.weeklyFarmCount.push({ week: week.week, value: week.value.length });
//   }

//   return output;
// }

// export async function GET() {
//   try {
//     const weeklyData = await fetchWeeklyData(0);
//     return NextResponse.json(weeklyData);
//   } catch (error) {
//     console.error('Error fetching weekly farm data:', error);
//     return NextResponse.json({ error: 'Error fetching weekly farm data' });
//   }
// }

import { NextResponse } from 'next/server';
import { IWeeklyDataByFarm } from '../../types';
import calculateWeeklyTokenRewards from '../../../../lib/utils/calculateWeeklyTokenRewards';
import calculateWeeklyCashRewards from '../../../../lib/utils/calculateWeeklyCashRewards';

export const revalidate = 7200;

// Define the shape of our response
interface Output {
  weeklyCarbonCredit: { week: number; value: number }[];
  weeklyFarmCount: { week: number; value: number }[];
  weeklyFarmIds: { week: number; value: number[] }[];
  weeklyTotalOutput: { week: number; value: number }[];
  weeklyDataByFarm: IWeeklyDataByFarm;
  weeklySolarPanelCount: { week: number; value: number }[];
}

// Return some fake data directly
export async function GET() {
  // Hardcoded example data
  const output: Output = {
    weeklyCarbonCredit: [
      { week: 0, value: 50 },
      { week: 1, value: 75 },
    ],
    weeklyFarmCount: [
      { week: 0, value: 2 },
      { week: 1, value: 3 },
    ],
    weeklyFarmIds: [
      { week: 0, value: [101, 102] },
      { week: 1, value: [101, 102, 103] },
    ],
    weeklyTotalOutput: [
      { week: 0, value: 1500 },
      { week: 1, value: 2200 },
    ],
    weeklyDataByFarm: {
      101: {
        powerOutputs: [{ week: 0, value: 1000 }, { week: 1, value: 1400 }],
        carbonCredits: [{ week: 0, value: 30 }, { week: 1, value: 50 }],
        weeklyPayments: [{ week: 0, value: 500 }, { week: 1, value: 700 }],
        weeklyTokenRewards: [{ week: 0, value: 10 }, { week: 1, value: 15 }],
        weeklyCashRewards: [{ week: 0, value: 5 }, { week: 1, value: 10 }],
      },
      102: {
        powerOutputs: [{ week: 0, value: 500 }, { week: 1, value: 800 }],
        carbonCredits: [{ week: 0, value: 20 }, { week: 1, value: 25 }],
        weeklyPayments: [{ week: 0, value: 200 }, { week: 1, value: 300 }],
        weeklyTokenRewards: [{ week: 0, value: 4 }, { week: 1, value: 6 }],
        weeklyCashRewards: [{ week: 0, value: 2 }, { week: 1, value: 3 }],
      },
      103: {
        powerOutputs: [{ week: 1, value: 0 }], // This farm appears only in week 1
        carbonCredits: [{ week: 1, value: 0 }],
        weeklyPayments: [{ week: 1, value: 0 }],
        weeklyTokenRewards: [{ week: 1, value: 0 }],
        weeklyCashRewards: [{ week: 1, value: 0 }],
      },
    },
    weeklySolarPanelCount: [
      { week: 0, value: 150 },
      { week: 1, value: 220 },
    ],
  };

  // (Optional) If you still want to run calculations over fake data:
  const weeklyTokenRewards = calculateWeeklyTokenRewards(output.weeklyDataByFarm);
  const weeklyCashRewards = calculateWeeklyCashRewards(output.weeklyDataByFarm);

  // Merge the calculated rewards into your fake data
  for (const farmId in output.weeklyDataByFarm) {
    if (weeklyTokenRewards[farmId]) {
      output.weeklyDataByFarm[farmId].weeklyTokenRewards =
        weeklyTokenRewards[farmId].weeklyTokenRewards;
    }
    if (weeklyCashRewards[farmId]) {
      output.weeklyDataByFarm[farmId].weeklyCashRewards =
        weeklyCashRewards[farmId].weeklyCashRewards;
    }
  }

  // Return the final fake data response
  return NextResponse.json(output);
}
