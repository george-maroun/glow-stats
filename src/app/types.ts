export type TSelectedDataType = 'outputs' | 'carbonCredits' | 'tokenRewards' | 'cashRewards' | 'farmCount' | 'solarPanelCount';

export type TDataPoint = { week: number; value: number };

export interface ISelectedFarmData {
  outputs: number[];
  carbonCredits: number[];
  tokenRewards: number[];
  cashRewards: number[];
  farmCount: number[];
  solarPanelCount: number[];
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

export interface IPanelCountPerFarm {
  [key: string]: number;
}

export interface FarmInfo {
  farmName: string;
  panelCount: number;
  location: string;
  averageSunlightPerDay: number;
  protocolFee: number;
}