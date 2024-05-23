export type TSelectedDataType = 'outputs' | 'carbonCredits' | 'tokenRewards' | 'cashRewards';

export type TDataPoint = { week: number; value: number };

export interface ISelectedFarmData {
  outputs: number[];
  carbonCredits: number[];
  tokenRewards: number[];
  cashRewards: number[];
}

export interface IWeeklyDataByFarm {
  [key: number]: {
    powerOutputs: TDataPoint[];
    carbonCredits: TDataPoint[];
    weeklyPayments: TDataPoint[];
    weeklyTokenRewards: TDataPoint[];
    weeklyCashRewards: TDataPoint[];
  }
}