import React, { useState } from 'react';
import useWeather from '../../hooks/useWeather';
import useFilteredData from '../../hooks/useFilteredData';
import FarmHeader from './FarmHeader';
import FarmInfo from './FarmInfo';
import FarmCharts from './FarmCharts';
import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';
import { TSelectedDataType, IWeeklyDataByFarm, TDataPoint } from '../../types';

interface IFarmDetailsProps {
  selectedFarm: number;
  equipmentDetails: any; // Define a more specific type
  weeklyFarmCount: TDataPoint[];
  weeklyDataByFarm: IWeeklyDataByFarm; // Define a more specific type
  handleResetFarmSelection: () => void;
}

const FarmDetails: React.FC<IFarmDetailsProps> = ({
  selectedFarm,
  equipmentDetails,
  weeklyFarmCount,
  weeklyDataByFarm,
  handleResetFarmSelection,
}) => {
  const [selectedDataType, setSelectedDataType] = useState<TSelectedDataType>('outputs');

  const weekCount = getWeeksSinceStart();
  const { selectedFarmWeather } = useWeather(equipmentDetails[selectedFarm]?.Latitude, equipmentDetails[selectedFarm]?.Longitude);
  const { selectedFarmData, dataLabels } = useFilteredData(weeklyDataByFarm, selectedFarm);

  const handleSetSelectedDataType = (type: TSelectedDataType) => {
    setSelectedDataType(type);
  }
  
  return (
    <div id='right-figure' className='rounded-xl lg:h-full h-auto lg:w-6/12 border' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
      <FarmHeader selectedFarm={selectedFarm} handleResetFarmSelection={handleResetFarmSelection} />
      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <FarmInfo
        selectedFarm={selectedFarm}
        equipmentDetails={equipmentDetails}
        weeklyFarmCount={weeklyFarmCount}
        weekCount={weekCount}
        selectedFarmData={selectedFarmData}
        selectedDataType={selectedDataType}
        selectedFarmWeather={selectedFarmWeather}
      />
      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div className='pl-4 pb-2 pt-2 text-gray text-md'>
        <FarmCharts
          selectedFarm={selectedFarm}
          weeklyFarmCount={weeklyFarmCount}
          selectedFarmData={selectedFarmData}
          selectedDataType={selectedDataType}
          handleSetSelectedDataType={handleSetSelectedDataType}
          dataLabels={dataLabels}
          weekCount={weekCount}
        />
      </div>
    </div>
  );
};

export default FarmDetails;

