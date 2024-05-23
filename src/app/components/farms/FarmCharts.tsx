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
  const labels = useMemo(() => Array.from({ length: weekCount + 1 }, (_, i) => `${i}`), [weekCount]);

  return selectedFarm ? (
    <>
      <DataTypeSelector selectedDataType={selectedDataType} onChange={(type: any) => handleSetSelectedDataType(type)} />
      {selectedDataType.includes('Reward') ? (
        <LineBarChart
          title=""
          labels={dataLabels}
          dataPoints={selectedFarmData[selectedDataType]}
        />
      ) : (
        <LineChart
          title=""
          labels={dataLabels}
          dataPoints={selectedFarmData[selectedDataType]}
        />
      )}
    </>
  ) : (
    <>
      <div>Weekly Farm Count</div>
      <LineChart
        title=""
        labels={labels}
        dataPoints={weeklyFarmCounts}
      />
    </>
  );
};

export default FarmCharts;
