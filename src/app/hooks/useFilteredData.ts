import { useState, useEffect } from 'react';

const getFilteredValues = (data: any, key: string, firstNonZeroIndex: number) => {
  if (!data) return [];
  const values = data[key]?.map((item: any) => item.value) || [];
  return values.slice(firstNonZeroIndex);
};

const getFirstNonZeroIndex = (data: any) => {
  if (!data) return -1;
  const values = data["powerOutputs"]?.map((item: any) => item.value) || [];
  return values.findIndex((value: any) => value !== 0);
}

const getFilteredLabels = (data: any, firstNonZeroIndex: number) => {
  if (!data) return [];
  return data.slice(firstNonZeroIndex, -1).map((item: any) => `${item.week}`);
};

const useFilteredData = (weeklyDataByFarm: any, selectedFarm: number) => {
  const [selectedFarmData, setSelectedFarmData] = useState<any>({ outputs: [], carbonCredits: [], tokenRewards: [] });
  const [dataLabels, setDataLabels] = useState<string[]>([]);

  useEffect(() => {
    const selectedFarmData = weeklyDataByFarm[selectedFarm];
    const firstNonZeroIndex = getFirstNonZeroIndex(selectedFarmData);
    
    if (selectedFarmData && firstNonZeroIndex !== -1) {
      const outputs = getFilteredValues(selectedFarmData, 'powerOutputs', firstNonZeroIndex);
      const carbonCredits = getFilteredValues(selectedFarmData, 'carbonCredits', firstNonZeroIndex);
      const weeklyTokenRewards = getFilteredValues(selectedFarmData, 'weeklyTokenRewards', firstNonZeroIndex);
      const weeklyCashRewards = getFilteredValues(selectedFarmData, 'weeklyCashRewards', firstNonZeroIndex);

      setSelectedFarmData({
        outputs,
        carbonCredits,
        tokenRewards: weeklyTokenRewards,
        cashRewards: weeklyCashRewards
      });

      const labels = getFilteredLabels(selectedFarmData.powerOutputs, firstNonZeroIndex);
      setDataLabels(labels);
    }
  }, [weeklyDataByFarm, selectedFarm]);

  return { selectedFarmData, dataLabels };
};

export default useFilteredData;
