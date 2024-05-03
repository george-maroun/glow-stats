import React, { useState, useEffect, useMemo } from 'react';
import LineChart from './LineChart';
import TopValues from './TopValues';
import StatusIndicator from './StatusIndicator';
import getPlaceName from '../../../lib/utils/getPlaceNameHelper';
import useWeather from '../hooks/useWeather';
import getWeeksSinceStart from '../../../lib/utils/currentWeekHelper';
import getWeatherEmoji from '../../../lib/utils/getWeatherEmojiHelper';

type IOutput = {
  week: number;
  value: number;
}

interface IFarmDetailsProps {
  selectedFarm: number;
  equipmentDetails: any; // Define a more specific type
  weeklyFarmCount: Array<{ week: number; value: number }>;
  weeklyDataByFarm: any; // Define a more specific type
  handleResetFarmSelection: () => void;
}

interface ISelectedFarmData {
  outputs: number[];
  carbonCredits: number[];
}

type TSelectedDataType = 'outputs' | 'carbonCredits';

const FarmDetails: React.FC<IFarmDetailsProps> = (props) => {
  const { 
    selectedFarm, 
    equipmentDetails,
    weeklyFarmCount, 
    weeklyDataByFarm,
    handleResetFarmSelection 
  } = props;

  const [selectedDataType, setSelectedDataType] = useState<TSelectedDataType>('outputs');
  const [dataLabels, setDataLabels] = useState<string[]>([]);

  const [selectedFarmData, setSelectedFarmData] = useState<ISelectedFarmData>({outputs: [], carbonCredits: []});
  
  const weekCount = getWeeksSinceStart();

  const [selectedFarmLocation, setSelectedFarmLocation] = useState<string>('');

  // Get Weather
  const lat = equipmentDetails[selectedFarm]?.Latitude;
  const lon = equipmentDetails[selectedFarm]?.Longitude;
  const { selectedFarmWeather } = useWeather(lat, lon);

  const weeklyFarmCounts = weeklyFarmCount?.map((data: {week: number, value: number}) => data.value);

  const labels = useMemo(() => Array.from({ length: weekCount + 1 }, (_, i) => `${i}`), [weekCount]);

  const pastMonthFarms = weeklyFarmCounts.length ? 
  weeklyFarmCounts[weeklyFarmCounts.length - 1] - weeklyFarmCounts[weeklyFarmCounts.length - 5]
  : 0;

  const ActiveFarmsCount = weeklyFarmCounts.length ? Number(weeklyFarmCounts[weeklyFarmCounts.length - 1]) : 0;
  const onboardingFarms = '0';


  useEffect(() => {
    const lat = equipmentDetails[selectedFarm]?.Latitude;
    const lng = equipmentDetails[selectedFarm]?.Longitude;
    if (lat && lng) {
      getPlaceName(lat, lng).then((locationName) => {
        const locArr = locationName.split(',');
        const city = locArr[1].trim();
        const state = locArr[2].trim().split(' ')[0];
        locationName = `${city}, ${state}`
        setSelectedFarmLocation(locationName);
      });
    }
  }, [selectedFarm, equipmentDetails])


  useEffect(() => {
    const outputs = weeklyDataByFarm[selectedFarm]?.powerOutputs;
    const outputValues = outputs?.map((output:IOutput) => output.value);
    const carbonCredits = weeklyDataByFarm[selectedFarm]?.carbonCredits;
    const carbonCreditsValues = carbonCredits?.map((output:IOutput) => output.value);
    
    setSelectedFarmData({outputs: outputValues, carbonCredits: carbonCreditsValues});
    
    const labels = outputs?.map((output:IOutput) => `${output.week}`);
    labels?.pop();  // Assuming you want to adjust the labels similarly for both data types
    setDataLabels(labels);
  }, [weeklyDataByFarm, selectedFarm, selectedDataType]);


  const DataTypeSelector = ({ onChange }: { onChange: (type: string) => void }) => {
    return (
      <select onChange={e => onChange(e.target.value)} value={selectedDataType}>
        <option value="outputs">Weekly Power Output (in kWh)</option>
        <option value="carbonCredits">Weekly Carbon Credits</option>
      </select>
    );
  }

  const getWeatherString = () => {
    const weatherEmoji = selectedFarmWeather ? getWeatherEmoji(selectedFarmWeather) : '';
    return selectedFarmWeather ? `${weatherEmoji} ${selectedFarmWeather?.main.temp.toFixed(1)}°F` : '';
  }

  const getLatestWeekOutput = () => {
    if (!selectedFarmData.outputs?.length) {
      return '';
    }
    const latestWeekOutput = selectedFarmData.outputs[selectedFarmData.outputs.length - 1];
    return `${latestWeekOutput.toFixed(0)} kWh`;
  }

  return (
    <div id='right-figure' className='rounded-xl lg:h-full h-auto lg:w-6/12 border' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
      <div className='p-4 pb-2 text-2xl flex flex-row justify-between items-center'>
        <div>{selectedFarm ? 
          (<div className='flex flex-row gap-4 items-center'>
            <div>
              {`Farm ${selectedFarm}`}
            </div>
            <StatusIndicator status={true} />
          </div>) 
          :  
          "Farms"}
        </div>
        {selectedFarm > 0 && (
          <div onClick={handleResetFarmSelection} className='pl-4 pb-0 p-1 text-gray text-base cursor-pointer underline decoration-1 underline-offset-1'>
            Back to all farms
          </div>
        )}
      </div>
      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>

    {selectedFarm > 0 ? 
      (<TopValues 
        title1='Location' 
        value1={selectedFarmLocation}
        title2='Weather'
        value2={getWeatherString()}
        title3={`Week ${weekCount} Output (so far)`}
        value3={getLatestWeekOutput()}
        />) :
      (<TopValues 
        title1='Active' 
        value1={ActiveFarmsCount}
        title2='Onboarding'
        value2={onboardingFarms}
        title3={"Past Month Increase"}
        value3={weeklyFarmCounts.length ? pastMonthFarms.toString() : 0}
        />
      )}

      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div className='pl-4 pb-2 pt-2 text-gray text-md'>
      {selectedFarm ? (
        <>
          <DataTypeSelector onChange={(type:any) => setSelectedDataType(type)} />
          <LineChart 
          title="" 
          labels={dataLabels} 
          dataPoints={selectedFarmData[selectedDataType]}
        /></>
        ) : (
          <>
            <div>Weekly Farm Count</div>
            <LineChart 
                title="" 
                labels={labels} 
                dataPoints={weeklyFarmCounts}
            />
          </>
          )}
      </div>
    </div>
  )
}

export default FarmDetails;