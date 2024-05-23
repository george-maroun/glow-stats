import { IWeeklyDataByFarm, TDataPoint } from '../../src/app/types';
import weeklyCashRewardsObj from './weeklyCashRewards';

interface FarmCashRewards {
  [farmId: number]: {
    weeklyCashRewards: TDataPoint[];
  };
}

function calculateWeeklyCashRewards(weeklyDataByFarm:IWeeklyDataByFarm): FarmCashRewards {
  const totalWeeklyCarbonCredits: { [week: number]: number } = {};
  const farmCashRewards: FarmCashRewards = {};

  // Calculate total weekly payments across all farms
  for (const farmId in weeklyDataByFarm) {
    weeklyDataByFarm[farmId].carbonCredits.forEach(({ week, value }: TDataPoint) => {
      if (!totalWeeklyCarbonCredits[week]) {
        totalWeeklyCarbonCredits[week] = 0;
      }
      totalWeeklyCarbonCredits[week] += value;
    });
  }

  // Calculate weekly token rewards for each farm
  for (const farmId in weeklyDataByFarm) {
    const weeklyCashRewards: TDataPoint[] = [];
    weeklyDataByFarm[farmId].carbonCredits.forEach(({ week, value }: TDataPoint) => {
      let sumAllWeeklyCarbonCredits = totalWeeklyCarbonCredits[week];
      let currWeekCashRewards:number = weeklyCashRewardsObj[week];
      let cashRewardValue = (currWeekCashRewards * value) / sumAllWeeklyCarbonCredits;
      weeklyCashRewards.push({ week, value: cashRewardValue || 0 });
    });
    farmCashRewards[Number(farmId)] = { weeklyCashRewards };
  }

  return farmCashRewards;
}


export default calculateWeeklyCashRewards;