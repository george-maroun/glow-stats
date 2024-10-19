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
    <div className="flex space-x-3 mb-1">
      <button
        className={`px-2 py-1 rounded-md text-sm ${
          selectedDataType === 'outputs'
            ? 'bg-[#EEEEEE]/80 text-[#666666] shadow-sm shadow-[#555555]/40'
            : 'bg-[#EEEEEE]/70 text-[#666666]'
        }`}
        onClick={() => onChange('outputs')}
      >
        Output (kWh)
      </button>
      <button
        className={`px-2 py-1 rounded-md text-sm ${
          selectedDataType === 'carbonCredits'
            ? 'bg-[#EEEEEE]/80 text-[#666666] shadow-sm shadow-[#555555]/40'
            : 'bg-[#EEEEEE]/70 text-[#666666]'
        }`}
        onClick={() => onChange('carbonCredits')}
      >
        Carbon Credits
      </button>
      <button
        className={`px-2 py-1 rounded-md text-sm ${
          selectedDataType === 'tokenRewards'
            ? 'bg-[#EEEEEE]/80 text-[#666666] shadow-sm shadow-[#555555]/40'
            : 'bg-[#EEEEEE]/70 text-[#666666]'
        }`}
        onClick={() => onChange('tokenRewards')}
      >
        Glow Rewards
      </button>
      <button
        className={`px-2 py-1 rounded-md text-sm ${
          selectedDataType === 'cashRewards'
            ? 'bg-[#EEEEEE]/80 text-[#666666] shadow-sm shadow-[#555555]/40'
            : 'bg-[#EEEEEE]/70 text-[#666666]'
        }`}
        onClick={() => onChange('cashRewards')}
      >
        USDG Rewards
      </button>
    </div>
  );
};

const AllFarmsDataTypeSelector: React.FC<DataTypeSelectorProps> = ({ selectedDataType, onChange }) => {
  return (
    <div className="flex space-x-3 mb-1 ">
      <button
        className={`px-2 py-1 rounded-md text-sm ${
          selectedDataType === 'farmCount'
            ? 'bg-[#EEEEEE]/80 text-[#666666] shadow-sm shadow-[#555555]/40'
            : 'bg-[#EEEEEE]/70 text-[#666666]'
        }`}
        onClick={() => onChange('farmCount')}
      >
        Farm Count
      </button>
      <button
        className={`px-2 py-1 rounded-md text-sm ${
          selectedDataType === 'solarPanelCount'
            ? 'bg-[#EEEEEE]/80 text-[#666666] shadow-sm shadow-[#555555]/40'
            : 'bg-[#EEEEEE]/70 text-[#666666]'
        }`}
        onClick={() => onChange('solarPanelCount')}
      >
        Solar Panel Count
      </button>
    </div>
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
