interface WeeklyPayment {
  week: number;
  value: number;
}

interface WeeklyTokenReward {
  week: number;
  value: number;
}

interface FarmTokenRewards {
  [farmId: number]: {
    weeklyTokenRewards: WeeklyTokenReward[];
  };
}

function calculateWeeklyTokenRewards(weeklyDataByFarm:any): FarmTokenRewards {
  const totalWeeklyPayments: { [week: number]: number } = {};
  const farmTokenRewards: FarmTokenRewards = {};

  // Calculate total weekly payments across all farms
  for (const farmId in weeklyDataByFarm) {
    weeklyDataByFarm[farmId].weeklyPayments.forEach(({ week, value }: WeeklyPayment) => {
      if (!totalWeeklyPayments[week]) {
        totalWeeklyPayments[week] = 0;
      }
      totalWeeklyPayments[week] += value;
    });
  }

  // Calculate weekly token rewards for each farm
  for (const farmId in weeklyDataByFarm) {
    const weeklyTokenRewards: WeeklyTokenReward[] = [];
    weeklyDataByFarm[farmId].weeklyPayments.forEach(({ week, value }: WeeklyPayment) => {
      const sumAllWeeklyPayments = totalWeeklyPayments[week];
      const tokenRewardValue = (175000 * value) / sumAllWeeklyPayments;
      weeklyTokenRewards.push({ week, value: tokenRewardValue || 0 });
    });
    farmTokenRewards[Number(farmId)] = { weeklyTokenRewards };
  }

  return farmTokenRewards;
}


export default calculateWeeklyTokenRewards;