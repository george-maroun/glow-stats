import { IWeeklyDataByFarm, TDataPoint } from '../../src/app/types';

interface FarmTokenRewards {
  [farmId: number]: {
    weeklyTokenRewards: TDataPoint[];
  };
}

function calculateWeeklyTokenRewards(weeklyDataByFarm:IWeeklyDataByFarm): FarmTokenRewards {
  const totalWeeklyPayments: { [week: number]: number } = {};
  const farmTokenRewards: FarmTokenRewards = {};

  // Calculate total weekly payments across all farms
  for (const farmId in weeklyDataByFarm) {
    weeklyDataByFarm[farmId].weeklyPayments.forEach(({ week, value }: TDataPoint) => {
      if (!totalWeeklyPayments[week]) {
        totalWeeklyPayments[week] = 0;
      }
      totalWeeklyPayments[week] += value;
    });
  }

  // Calculate weekly token rewards for each farm
  for (const farmId in weeklyDataByFarm) {
    const weeklyTokenRewards: TDataPoint[] = [];
    weeklyDataByFarm[farmId].weeklyPayments.forEach(({ week, value }: TDataPoint) => {
      const sumAllWeeklyPayments = totalWeeklyPayments[week];
      const tokenRewardValue = (175000 * value) / sumAllWeeklyPayments;
      weeklyTokenRewards.push({ week, value: tokenRewardValue || 0 });
    });
    farmTokenRewards[Number(farmId)] = { weeklyTokenRewards };
  }

  return farmTokenRewards;
}


export default calculateWeeklyTokenRewards;