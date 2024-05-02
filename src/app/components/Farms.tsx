"use client"
// TODO: Refactor this file
// TODO: Create a separate component for top-values
import LineChart from './LineChart';
import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import getWeeksSinceStart from '../../../lib/utils/currentWeekHelper';
import getWeatherEmoji from '../../../lib/utils/getWeatherEmojiHelper'
import getPlaceName from '../../../lib/utils/getPlaceNameHelper';
import StatusIndicator from './StatusIndicator';
import ChartCounter from './ChartCounter';
import TopValues from './TopValues';
import 'react-tooltip/dist/react-tooltip.css'
export const fetchCache = 'force-no-store';
export const dynamic = "force-dynamic";


type WeatherData = {
  main: {
    temp: number;
  },
  weather: [{
    description: string;
  }],
  name: string;
};

interface WeeklyDataByFarm {
  [key: number]: {
    powerOutputs: { week: number; value: number }[];
    carbonCredits: { week: number; value: number }[];
  }
}

interface FarmsProps {
  labels: string[];
  weeklyFarmCount: {week: number, value: number}[];
  weeklyDataByFarm: WeeklyDataByFarm;
  currentFarmIds: number[];
}

interface WeeklyData {
  week: number;
  value: number;
}

interface Equipment {
  ShortID: number;
  PublicKey: number[];
  Latitude: number;
  Longitude: number;
  Capacity: number;
  Debt: number;
  Expiration: number;
  Initialization: number;
  ProtocolFee: number;
  Signature: number[];
}

type EquipmentDetails = {
  [key: string]: Equipment;
}

// type Rewards = {
//   amountInBucket: string;
//   amountToDeduct: string;
//   weekNumber: number;
// }[]

export default function Farms({ labels, weeklyFarmCount, weeklyDataByFarm, currentFarmIds }: FarmsProps) {
  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentDetails>({});
  const [selectedFarm, setSelectedFarm] = useState<number>(0);
  const [selectedDataType, setSelectedDataType] = useState('powerOutput');

  const [mapZoom, setMapZoom] = useState<number>(4);
  const [dataLabels, setDataLabels] = useState<string[]>([]);
  const [selectedFarmOutputs, setSelectedFarmOutputs] = useState<number[]>([]);
  const [selectedFarmCarbonCredits, setselectedFarmCarbonCredits] = useState<number[]>([]);
  const weekCount = getWeeksSinceStart();

  const [selectedFarmLocation, setSelectedFarmLocation] = useState<string>('');
  const [selectedFarmWeather, setSelectedFarmWeather] = useState<WeatherData>();
  
  const [mapCenter, setMapCenter] = useState<{lat:number; lng:number}>({ lat: 38.794810, lng: -97.058722 });
  const key:string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  const weeklyFarmCounts = weeklyFarmCount?.map((data: {week: number, value: number}) => data.value);

  console.log({weeklyFarmCount})
  let dataPoints;
  if (selectedFarm) {
    dataPoints = selectedDataType === 'powerOutput' ? selectedFarmOutputs : selectedFarmCarbonCredits;
  } else {
    dataPoints = weeklyFarmCounts;
  }

  const pastMonthFarms = weeklyFarmCounts.length ? 
  weeklyFarmCounts[weeklyFarmCounts.length - 1] - weeklyFarmCounts[weeklyFarmCounts.length - 5]
  : 0;

  const ActiveFarmsCount = weeklyFarmCounts.length ? Number(weeklyFarmCounts[weeklyFarmCounts.length - 1]) : 0;
  const onboardingFarms = '0';

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: key,
  });

  const weatherEmoji = selectedFarmWeather ? getWeatherEmoji(selectedFarmWeather) : '';

  useEffect(() => {
    setDataLabels(labels);
  }, [labels]);

  // Get location name for the selected farm
  useEffect(() => {
    if (!selectedFarm) {
      return;
    }
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

  // Get weather data for the selected farm
  useEffect(() => {
    const fetchWeather = async (lat:number, lon:number) => {
      const url = `/api/weatherData?lat=${lat}&lon=${lon}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }
        const data = await response.json();
        setSelectedFarmWeather(data.weatherJson);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    const lat = equipmentDetails[selectedFarm]?.Latitude;
    const lng = equipmentDetails[selectedFarm]?.Longitude;
    if (lat && lng) {
      fetchWeather(lat, lng);
    }
  }, [selectedFarm, equipmentDetails]); 

  // Fetch equipment data from the API
  useEffect(() => {
    const fetchData = async () => {
      const currFarmsIds = new Set(currentFarmIds);
      const response = await fetch('api/equipmentData');
      const res = await response.json();
      const data = res.equipmentJson.EquipmentDetails;
      const filteredEquipmentDetails: EquipmentDetails = {};
      Object.keys(data).forEach((key: string) => {
        if (currFarmsIds.has(Number(key))) {
          filteredEquipmentDetails[key] = data[key];
        }
      });
      setEquipmentDetails(filteredEquipmentDetails);
    }
    fetchData();
  }, [currentFarmIds]);


  useEffect(() => {
    const outputs = weeklyDataByFarm[selectedFarm]?.powerOutputs;
    console.log({weeklyDataByFarm})
    const carbonCredits = weeklyDataByFarm[selectedFarm]?.carbonCredits;
    if (outputs && selectedDataType === 'powerOutput') {
      setSelectedFarmOutputs(outputs.map(output => output.value));
    } else if (carbonCredits && selectedDataType === 'carbonCredits') {
      setselectedFarmCarbonCredits(carbonCredits.map(output => output.value));
    }
    const labels = outputs?.map(output => `${output.week}`);
    labels?.pop();  // Assuming you want to adjust the labels similarly for both data types
    setDataLabels(labels);
  }, [weeklyDataByFarm, selectedFarm, selectedDataType]);


  function handleFarmSelection(detail: Equipment) {
    setMapCenter({ lat: detail.Latitude, lng: detail.Longitude });
    setSelectedFarm(detail.ShortID);
    setMapZoom(prev => 7);
  }

  function handleResetFarmSelection() {
    setMapCenter({ lat: 38.794810, lng: -97.058722 } );
    setSelectedFarm(0);
    setDataLabels(labels);
    setMapZoom(prev => 4);
  }

  function DataTypeSelector({ onChange }:any) {
    return (
      <select onChange={e => onChange(e.target.value)} value={selectedDataType}>
        <option value="powerOutput">Weekly Power Output (in kWh)</option>
        <option value="carbonCredits">Weekly Carbon Credits</option>
      </select>
    );
  }

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '12px',
  };

  const weatherString = selectedFarmWeather ? `${weatherEmoji} ${selectedFarmWeather?.main.temp.toFixed(1)}°F` : '';

  return (
    <>
      <div id='figures' className='flex lg:flex-row flex-col gap-2 lg:h-96 mt-4'>
        <div id='left-figure' className='rounded-xl lg:h-full h-80 lg:w-6/12 border ' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
            >
              {Object.values(equipmentDetails).map((detail: Equipment, index: number) => {
                return (
                  <Marker
                    key={detail.ShortID}
                    position={{ lat: detail.Latitude, lng: detail.Longitude }}
                    onClick={() => handleFarmSelection(detail)}
                  />
                );
              })}
            </GoogleMap>
          )}
        </div>
        
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
            value2={weatherString}
            title3={`Week ${weekCount} Output (so far)`}
            value3={`${selectedFarmOutputs.length ? selectedFarmOutputs[selectedFarmOutputs.length - 1].toFixed(0) : ''} kWh`}
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
              dataPoints={selectedDataType === 'powerOutput' ? selectedFarmOutputs : selectedFarmCarbonCredits}
            /></>
            ) : (
              <>
              <div>Weekly Farm Count</div>
            <LineChart 
              title="" 
              labels={dataLabels} 
              dataPoints={dataPoints}
            /></>)}
          </div>
        </div>
      </div>

      <div onClick={() => setSelectedFarm([20,26,50,70][Math.floor(Math.random()*4)])}>MOCK SELECT FARM</div>
    </>
  )
}

