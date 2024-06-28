import React from 'react';
import TopValues from '../TopValues';
import useFarmLocation from '../../hooks/useFarmLocation';
import getWeatherEmoji from '../../../../lib/utils/getWeatherEmojiHelper';
import { ISelectedFarmData, TSelectedDataType } from '../../types';
import { useFarmsInfo } from '../../providers/allFarmsInfoProvider'
import formatLocation from "./helpers/formatLocationHelper";

interface FarmInfoProps {
  selectedFarm: number;
  equipmentDetails: any;
  weeklyFarmCount: Array<{ week: number; value: number }>;
  weekCount: number;
  selectedFarmData: ISelectedFarmData;
  selectedDataType: TSelectedDataType;
  selectedFarmWeather: any;
  farmLocations: any;
}

const FarmInfo: React.FC<FarmInfoProps> = ({
  selectedFarm,
  equipmentDetails,
  weeklyFarmCount,
  weekCount,
  selectedFarmData,
  selectedDataType,
  selectedFarmWeather,
  farmLocations
}) => {

  const allFarmsInfo = useFarmsInfo();

  const selectedFarmLocation = farmLocations ? farmLocations[selectedFarm] : 'USA';
  
  // const getWeatherString = () => {
  //   const weatherEmoji = selectedFarmWeather ? getWeatherEmoji(selectedFarmWeather) : '';
  //   return selectedFarmWeather ? `${weatherEmoji} ${selectedFarmWeather?.main.temp.toFixed(1)}°F` : '';
  // };

  const dataTypeName = {
    outputs: ['Output', 'kWh'],
    carbonCredits: ['Carbon Credits', ''],
    tokenRewards: ['Token Rewards', 'GLW'],
    cashRewards: ['USDG Rewards', 'USDG'],
  }

  const getLatestWeekDataPoint = () => {
    if (!selectedFarmData[selectedDataType]?.length) {
      return '';
    }
    const latestWeekDataPoint = selectedFarmData[selectedDataType][selectedFarmData[selectedDataType].length - 1];
    let value;
    if (selectedDataType === 'carbonCredits') {
      value = latestWeekDataPoint.toFixed(3);
    } else {
      value = latestWeekDataPoint.toFixed(0).toLocaleString();
    }
    return `${value} ${dataTypeName[selectedDataType][1]}`;
  };

  const weeklyFarmCounts = weeklyFarmCount.map(data => data.value);
  const pastMonthFarms = weeklyFarmCounts.length ? 
    weeklyFarmCounts[weeklyFarmCounts.length - 1] - weeklyFarmCounts[weeklyFarmCounts.length - 5] : 0;
  const ActiveFarmsCount = weeklyFarmCounts.length ? Number(weeklyFarmCounts[weeklyFarmCounts.length - 1]) : 0;
  const newFarms = weeklyFarmCounts.length ? weeklyFarmCounts[weeklyFarmCounts.length - 2] - weeklyFarmCounts[weeklyFarmCounts.length - 3] : 0;

  return selectedFarm > 0 ? (
    <TopValues
      title1='Location'
      value1={formatLocation(selectedFarmLocation)}
      title2='Solar Panel Count'
      value2={allFarmsInfo[selectedFarm]?.panelCount}
      title3={`Week ${weekCount} ${dataTypeName[selectedDataType][0]} (so far)`}
      value3={getLatestWeekDataPoint()}
    />
  ) : (
    <TopValues
      title1='Active Farms'
      value1={ActiveFarmsCount}
      title2='Added Last Week'
      value2={newFarms.toString()}
      title3='Past Month Increase'
      value3={weeklyFarmCounts.length ? pastMonthFarms.toString() : '0'}
    />
  );
};

export default FarmInfo;
