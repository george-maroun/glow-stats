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
  weeklySolarPanelCount: Array<{ week: number; value: number }>;
  weekCount: number;
  selectedFarmData: ISelectedFarmData;
  selectedDataType: TSelectedDataType;
  selectedFarmWeather: any;
  farmLocations: any;
  allFarmSelectedDataType: string;
}

const FarmInfo: React.FC<FarmInfoProps> = ({
  selectedFarm,
  equipmentDetails,
  weeklyFarmCount,
  weeklySolarPanelCount,
  weekCount,
  selectedFarmData,
  selectedDataType,
  selectedFarmWeather,
  farmLocations,
  allFarmSelectedDataType
}) => {

  const allFarmsInfo = useFarmsInfo();

  const selectedFarmLocation = farmLocations ? farmLocations[selectedFarm] : 'USA';
  
  const dataTypeName = {
    outputs: ['Output', 'kWh'],
    carbonCredits: ['Carbon Credits', ''],
    tokenRewards: ['Token Rewards', 'GLW'],
    cashRewards: ['USDG Rewards', 'USDG'],
    farmCount: ['Farm Count', ''],
    solarPanelCount: ['Solar Panel Count', '']
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
      value = latestWeekDataPoint.toFixed(0);
    }
    return `${Number(value).toLocaleString()} ${dataTypeName[selectedDataType][1]}`;
  };

  const getSelectedFarmPanelCount = () => {
    if (selectedFarm === 0) {
      return 0;
    }

    if (!allFarmsInfo) {
      return 0;
    }

    if (allFarmsInfo.hasOwnProperty(selectedFarm)) {
      return allFarmsInfo[selectedFarm].panelCount;
    }

    for (const farm of Object.values(allFarmsInfo)) {
      if ((farm as any).farmName.includes(selectedFarm.toString())) {
        return (farm as any).panelCount;
      }
    }
  }

  const getSolarPanelInfo = () => {
    if (!weeklySolarPanelCount || weeklySolarPanelCount.length === 0) {
      return { count: 'N/A', lastWeekChange: 'N/A', lastMonthChange: 'N/A' };
    }
    const counts = weeklySolarPanelCount.map(data => data.value);
    return getInfoFromCounts(counts);
  }

  const getFarmCountInfo = () => {
    if (!weeklyFarmCount || weeklyFarmCount.length === 0) {
      return { count: 'N/A', lastWeekChange: 'N/A', lastMonthChange: 'N/A' };
    }
    const counts = weeklyFarmCount.map(data => data.value);
    return getInfoFromCounts(counts);
  }

  const getInfoFromCounts = (counts: number[]) => {
    if (counts.length < 5) {
      return { count: 'N/A', lastWeekChange: 'N/A', lastMonthChange: 'N/A' };
    }
    const currentCount = counts[counts.length - 1];
    const lastWeekChange = counts[counts.length - 1] - counts[counts.length - 2];
    const lastMonthChange = counts[counts.length - 1] - counts[counts.length - 5];

    return {
      count: currentCount.toString(),
      lastWeekChange: lastWeekChange > 0 ? `+${lastWeekChange}` : lastWeekChange.toString(),
      lastMonthChange: lastMonthChange > 0 ? `+${lastMonthChange}` : lastMonthChange.toString()
    };
  }

  return selectedFarm > 0 ? (
    <TopValues
      title1='Location'
      value1={formatLocation(selectedFarmLocation)}
      title2='Solar Panel Count'
      value2={getSelectedFarmPanelCount().toString()}
      title3={`Week ${weekCount} ${dataTypeName[selectedDataType][0]} (so far)`}
      value3={getLatestWeekDataPoint()}
    />
  ) : allFarmSelectedDataType === 'solarPanelCount' ? (
    <TopValues
      title1='Solar Panel Count'
      value1={getSolarPanelInfo().count}
      title2='Last Week Change'
      value2={getSolarPanelInfo().lastWeekChange}
      title3='Last Month Change'
      value3={getSolarPanelInfo().lastMonthChange}
    />
  ) : (
    <TopValues
      title1='Active Farms'
      value1={getFarmCountInfo().count}
      title2='Last Week Change'
      value2={getFarmCountInfo().lastWeekChange}
      title3='Last Month Change'
      value3={getFarmCountInfo().lastMonthChange}
    />
  );
};

export default FarmInfo;