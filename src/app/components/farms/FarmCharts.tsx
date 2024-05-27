import React, { useMemo } from 'react';
import LineChart from '../LineChart';
import LineBarChart from '../LineBarChart';
import DataTypeSelector from './DataTypeSelector';
import { ISelectedFarmData, TSelectedDataType } from '../../types';

interface FarmChartsProps {
  selectedFarm: number;
  weeklyFarmCount: Array<{ week: number; value: number }>;
  selectedFarmData: ISelectedFarmData;
  selectedDataType: TSelectedDataType;
  handleSetSelectedDataType: (type: TSelectedDataType) => void;
  dataLabels: string[];
  weekCount: number;
}

const FarmCharts: React.FC<FarmChartsProps> = ({
  selectedFarm,
  weeklyFarmCount,
  selectedFarmData,
  selectedDataType,
  handleSetSelectedDataType,
  dataLabels,
  weekCount
}) => {
  const weeklyFarmCounts = weeklyFarmCount.map(data => data.value);
  const labels = useMemo(() => Array.from({ length: weekCount }, (_, i) => `${i}`), [weekCount]);

  const removeLastElement = (arr: any[]) => {
    return arr.slice(0, arr.length - 1);
  }

  return selectedFarm ? (
    <>
      <DataTypeSelector selectedDataType={selectedDataType} onChange={(type: any) => handleSetSelectedDataType(type)} />
      {selectedDataType.includes('Reward') ? (
        <LineBarChart
          title=""
          labels={dataLabels}
          dataPoints={removeLastElement(selectedFarmData[selectedDataType])}
        />
      ) : (
        <LineChart
          title=""
          labels={dataLabels}
          dataPoints={removeLastElement(selectedFarmData[selectedDataType])}
        />
      )}
    </>
  ) : (
    <>
      <div>Weekly Farm Count</div>
      <LineChart
        title=""
        labels={labels}
        dataPoints={removeLastElement(weeklyFarmCounts)}
      />
    </>
  );
};

export default FarmCharts;
