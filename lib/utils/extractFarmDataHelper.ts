import { byteArrToStr } from "./byteArrayHelpers";

interface FarmOutput {
  totalOutput: number;
  weeklyOutputs: { week: number; value: number }[];
}

export interface Devices {
  Devices: {
    PublicKey: number[];
    PowerOutputs: number[];
    ImpactRates: number[];
  }[];
}

export default function extractData(data: Devices, farmOutputs: Record<string, FarmOutput>, i: number) {

  for (let device of data.Devices) {
    const publicKey = byteArrToStr(device["PublicKey"]);
    const currWeekOutput = device["PowerOutputs"].reduce((acc: number, curr: number) => acc + curr, 0);

    if (!farmOutputs.hasOwnProperty(publicKey)) {
      const currFarmData = {totalOutput: 0, weeklyOutputs: []};
      farmOutputs[publicKey] = currFarmData;
    }
    farmOutputs[publicKey].weeklyOutputs.push({week: i, value: currWeekOutput});
    farmOutputs[publicKey].totalOutput += currWeekOutput;
  }

  return farmOutputs;
}