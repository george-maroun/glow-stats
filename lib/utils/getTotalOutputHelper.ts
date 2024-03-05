import { Devices } from "./extractFarmDataHelper";

export default function getTotalOutput(data:Devices) {
  let totalOutput = 0;
  data.Devices.forEach((device:any) => {
      totalOutput += device.PowerOutputs.reduce((a:any, b:any) => a + b, 0);
  });

  return totalOutput;
}