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
    <div className="flex mb-1 gap-2 bg-[#EEEEEE]/70 rounded-md items-center justify-between px-2 w-[94%] sm:w-[494px] py-1 sm:py-0 sm:h-[34px]">
      <div className="flex gap-2 w-full justify-center sm:bg-transparent rounded-md">
        <button
          className={`px-2 py-[0.23rem] rounded-md text-sm flex-1 sm:flex-initial ${
            selectedDataType === 'outputs'
              ? 'bg-[#ffffff] text-[#000000] shadow-md font-semibold'
              : 'text-[#666666] font-semibold'
          }`}
          onClick={() => onChange('outputs')}
        >
          Output (kWh)
        </button>
        <button
          className={`px-2 py-[0.23rem] rounded-md text-sm flex-1 sm:flex-initial ${
            selectedDataType === 'carbonCredits'
              ? 'bg-[#ffffff] text-[#000000] shadow-md font-semibold'
              : 'text-[#666666] font-semibold'
          }`}
          onClick={() => onChange('carbonCredits')}
        >
          Carbon Credits
        </button>
        <button
          className={`px-2 py-[0.23rem] rounded-md text-sm flex-1 sm:flex-initial ${
            selectedDataType === 'tokenRewards'
              ? 'bg-[#ffffff] text-[#000000] shadow-md font-semibold'
              : 'text-[#666666] font-semibold'
          }`}
          onClick={() => onChange('tokenRewards')}
        >
          Glow Rewards
        </button>
        <button
          className={`px-2 py-[0.23rem] rounded-md text-sm flex-1 sm:flex-initial ${
            selectedDataType === 'cashRewards'
              ? 'bg-[#ffffff] text-[#000000] shadow-md font-semibold'
              : 'text-[#666666] font-semibold'
          }`}
          onClick={() => onChange('cashRewards')}
        >
          USDG Rewards
        </button>
      </div>
    </div>
  );
};

const AllFarmsDataTypeSelector: React.FC<DataTypeSelectorProps> = ({ selectedDataType, onChange }) => {
  return (
    <div className="flex items-center justify-between px-1 gap-2 mb-1 bg-[#EEEEEE]/70 w-[255px] rounded-md h-[34px]">
      <button
        className={`px-2 py-[0.23rem] rounded-md text-sm ${
          selectedDataType === 'farmCount'
            ? 'bg-[#ffffff] text-[#000000] shadow-md font-semibold'
            : 'text-[#666666] font-semibold'
        }`}
        onClick={() => onChange('farmCount')}
      >
        Farm Count
      </button>
      <button
        className={`px-2 py-[0.23rem] rounded-md text-sm ${
          selectedDataType === 'solarPanelCount'
            ? 'bg-[#ffffff] text-[#000000] shadow-md font-semibold'
            : 'text-[#666666] font-semibold'
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
      <div className='ml-3'>
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
      </div>
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
