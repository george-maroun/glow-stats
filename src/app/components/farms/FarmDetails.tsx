import React, { useEffect, useState } from 'react';
import useWeather from '../../hooks/useWeather';
import useFilteredData from '../../hooks/useFilteredData';
import FarmHeader from './FarmHeader';
import FarmInfo from './FarmInfo';
import FarmCharts from './FarmCharts';
import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';
import { TSelectedDataType, IWeeklyDataByFarm, TDataPoint } from '../../types';
import extractCoordinates from '../../../../lib/utils/extractCoordinates';
import { useFarmsInfo } from '../../providers/allFarmsInfoProvider';

interface IFarmDetailsProps {
  selectedFarm: number;
  equipmentDetails: any;
  weeklyFarmCount: TDataPoint[];
  weeklySolarPanelCount: TDataPoint[];
  weeklyDataByFarm: IWeeklyDataByFarm;
  handleResetFarmSelection: () => void;
  farmLocations: any;
}

const FarmDetails: React.FC<IFarmDetailsProps> = ({
  selectedFarm,
  equipmentDetails,
  weeklyFarmCount,
  weeklyDataByFarm,
  weeklySolarPanelCount,
  handleResetFarmSelection,
  farmLocations,
}) => {
  const [selectedDataType, setSelectedDataType] = useState<TSelectedDataType>('outputs');
  const [allFarmSelectedDataType, setAllFarmSelectedDataType] = useState<string>('farmCount');

  // const allFarmsInfo = useFarmsInfo();

  // const weekCount = getWeeksSinceStart();


  // let coordinates = selectedFarm ? extractCoordinates(allFarmsInfo[selectedFarm].coordinates) : { latitude: 0, longitude: 0 };

  // const { selectedFarmWeather } = useWeather(coordinates?.latitude, coordinates?.longitude);

  const weekCount = getWeeksSinceStart();
  const { selectedFarmWeather } = useWeather(equipmentDetails[selectedFarm]?.Latitude, equipmentDetails[selectedFarm]?.Longitude);
  const { selectedFarmData, dataLabels } = useFilteredData(weeklyDataByFarm, selectedFarm);

  const handleSetSelectedDataType = (type: TSelectedDataType) => {
    setSelectedDataType(type);
  }

  const handleSetAllFarmSelectedDataType = (type: string) => {
    setAllFarmSelectedDataType(type);
  }
  
  return (
    <div id='right-figure' className='rounded-xl lg:h-full h-auto lg:w-6/12 border' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
      <FarmHeader selectedFarm={selectedFarm} handleResetFarmSelection={handleResetFarmSelection} selectedFarmWeather={selectedFarmWeather} />
      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <FarmInfo
        selectedFarm={selectedFarm}
        equipmentDetails={equipmentDetails}
        weeklyFarmCount={weeklyFarmCount}
        weeklySolarPanelCount={weeklySolarPanelCount}
        weekCount={weekCount}
        selectedFarmData={selectedFarmData}
        selectedDataType={selectedDataType}
        selectedFarmWeather={selectedFarmWeather}
        farmLocations={farmLocations}
        allFarmSelectedDataType={allFarmSelectedDataType}
      />
      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div className='pl-4 pb-2 pt-2 text-gray text-md'>
        <FarmCharts
          selectedFarm={selectedFarm}
          weeklyFarmCount={weeklyFarmCount}
          selectedFarmData={selectedFarmData}
          selectedDataType={selectedDataType}
          allFarmSelectedDataType={allFarmSelectedDataType}
          weeklySolarPanelCount={weeklySolarPanelCount}
          handleSetSelectedDataType={handleSetSelectedDataType}
          handleSetAllFarmSelectedDataType={handleSetAllFarmSelectedDataType}
          dataLabels={dataLabels}
          weekCount={weekCount}
        />
      </div>
    </div>
  );
};

export default FarmDetails;