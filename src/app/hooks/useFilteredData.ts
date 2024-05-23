import { useState, useEffect } from 'react';

const getFilteredValues = (data: any, key: any) => {
  if (!data) return [];
  const values = data[key]?.map((item: any) => item.value) || [];
  const firstNonZeroIndex = values.findIndex((value: any) => value !== 0);
  return values.slice(firstNonZeroIndex);
};

const getFilteredLabels = (data: any) => {
  if (!data) return [];
  const firstNonZeroIndex = data.findIndex((item: any) => item.value !== 0);
  return data.slice(firstNonZeroIndex).map((item: any) => `${item.week}`);
};

const useFilteredData = (weeklyDataByFarm: any, selectedFarm: number) => {
  const [selectedFarmData, setSelectedFarmData] = useState<any>({ outputs: [], carbonCredits: [], tokenRewards: [] });
  const [dataLabels, setDataLabels] = useState<string[]>([]);

  useEffect(() => {
    const selectedFarmData = weeklyDataByFarm[selectedFarm];
    if (selectedFarmData) {
      const outputs = getFilteredValues(selectedFarmData, 'powerOutputs');
      const carbonCredits = getFilteredValues(selectedFarmData, 'carbonCredits');
      const weeklyTokenRewards = getFilteredValues(selectedFarmData, 'weeklyTokenRewards');

      setSelectedFarmData({
        outputs,
        carbonCredits,
        tokenRewards: weeklyTokenRewards
      });

      const labels = getFilteredLabels(selectedFarmData.powerOutputs);
      setDataLabels(labels);
    }
  }, [weeklyDataByFarm, selectedFarm]);

  return { selectedFarmData, dataLabels };
};

export default useFilteredData;
