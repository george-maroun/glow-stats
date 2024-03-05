import extractData from '../lib/utils/extractFarmDataHelper';

// Test data:
// - One device with no output
// - Two devices with output
// - One device online from second week

const testData = [
  {
    Devices: [
      {
        PublicKey: [225],
        PowerOutputs: [1, 1, 1],
      },
      {
        PublicKey: [112],
        PowerOutputs: [1, 2, 3],
      },
    ]
  },
  {
    Devices: [
      {
        PublicKey: [207],
        PowerOutputs: [0, 0, 0],
      },
      {
        PublicKey: [225],
        PowerOutputs: [1, 1, 1],
      },
      {
        PublicKey: [112],
        PowerOutputs: [1, 2, 3],
      },
    ]
  },

];

const mockGetFarmData = (data:any) => {
  const farmOutputs = {};
  for (let i = 0; i < data.length; i++) {
    extractData(data[i], farmOutputs, i);
  }
  return farmOutputs;
}


interface FarmOutput {
  totalOutput: number;
  weeklyOutputs: { week: number; value: number }[];
}



describe('mockGetFarmData', () => {
  it('correctly processes data array and returns expected farm outputs', () => {
    const result = mockGetFarmData(testData);

    // Expected output structure based on the provided data
    const expectedOutput:Record<string, FarmOutput> = {
      e1: { totalOutput: 6, weeklyOutputs: [{week: 0, value: 3}, {week: 1, value: 3}] },
      70: { totalOutput: 12, weeklyOutputs: [{week: 0, value: 6}, {week: 1, value: 6}] },
      cf: { totalOutput: 0, weeklyOutputs: [{week: 1, value: 0}] },
    };

    let count = 0;
    for (let farm in expectedOutput) {
      if (expectedOutput[farm].totalOutput > 0) {
        count++;
      }
    }

    expect(result).toEqual(expectedOutput);
    expect(count).toEqual(2);
  });
});