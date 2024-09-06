import React, { useMemo } from 'react';
import LineChart from '../LineChart';
import LineBarChart from '../LineBarChart';
import { ISelectedFarmData, TSelectedDataType } from '../../types';

interface FarmChartsProps {
  selectedFarm: number;
  weeklyFarmCount: Array<{ week: number; value: number }>;
  selectedFarmData: ISelectedFarmData;
  selectedDataType: TSelectedDataType;
  allFarmSelectedDataType: string;
  handleSetSelectedDataType: (type: TSelectedDataType) => void;
  handleSetAllFarmSelectedDataType: (type: string) => void;
  weeklySolarPanelCount: Array<{ week: number; value: number }>;
  dataLabels: string[];
  weekCount: number;
}

interface DataTypeSelectorProps {
  selectedDataType: string;
  onChange: (type: string) => void;
}

const FarmSpecificDataTypeSelector: React.FC<DataTypeSelectorProps> = ({ selectedDataType, onChange }) => {
  return (
    <select onChange={e => onChange(e.target.value)} value={selectedDataType}>
      <option value="outputs">Weekly Power Output (kWh)</option>
      <option value="carbonCredits">Weekly Carbon Credits</option>
      <option value="tokenRewards">Weekly Token Rewards ($GLW)</option>
      <option value="cashRewards">Weekly USDG Rewards ($)</option>
    </select>
  );
};

const AllFarmsDataTypeSelector: React.FC<DataTypeSelectorProps> = ({ selectedDataType, onChange }) => {
  return (
    <select onChange={e => onChange(e.target.value)} value={selectedDataType}>
      <option value="farmCount">Weekly Farm Count</option>
      <option value="solarPanelCount">Weekly Solar Panel Count</option>
    </select>
  );
};

const FarmCharts: React.FC<FarmChartsProps> = ({
  selectedFarm,
  weeklyFarmCount,
  selectedFarmData,
  weeklySolarPanelCount,
  selectedDataType,
  allFarmSelectedDataType,
  handleSetSelectedDataType,
  handleSetAllFarmSelectedDataType,
  dataLabels,
  weekCount
}) => {
  const labels = useMemo(() => Array.from({ length: weekCount + 1 }, (_, i) => `${i}`), [weekCount]);

  console.log(labels);

  const removeLastElement = (arr: any[]) => {
    return arr.slice(0, arr.length - 1);
  }

  const getDataPoints = () => {
    if (selectedFarm) {
      return removeLastElement(selectedFarmData[selectedDataType]);
    } else {
      return allFarmSelectedDataType === 'farmCount'
        ? weeklyFarmCount.map(data => data.value)
        : weeklySolarPanelCount.map(data => data.value);
    }
  };

  return (
    <>
      {selectedFarm ? (
        <FarmSpecificDataTypeSelector
          selectedDataType={selectedDataType}
          onChange={(type: any) => handleSetSelectedDataType(type)}
        />
      ) : (
        <AllFarmsDataTypeSelector
          selectedDataType={allFarmSelectedDataType}
          onChange={(type: any) => handleSetAllFarmSelectedDataType(type)}
        />
      )}
      {selectedFarm && selectedDataType.includes('Reward') ? (
        <LineBarChart
          title=""
          labels={dataLabels}
          dataPoints={getDataPoints()}
        />
      ) : (
        <LineChart
          title=""
          labels={selectedFarm ? dataLabels : labels}
          dataPoints={getDataPoints()}
        />
      )}
    </>
  );
};

export default FarmCharts;