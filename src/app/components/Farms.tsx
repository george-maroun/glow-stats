"use client"
// TODO: Refactor this file
// TODO: Create a separate component for top-values
import LineChart from '../components/LineChart';
import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { invertObject } from '../../../lib/utils/byteArrayHelpers';
import getWeeksSinceStart from '../../../lib/utils/currentWeekHelper';
import getWeatherEmoji from '../../../lib/utils/getWeatherEmojiHelper'
import getPlaceName from '../../../lib/utils/getPlaceNameHelper';
import StatusIndicator from '../components/StatusIndicator';
import ChartCounter from '../components/ChartCounter';
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

interface FarmsProps {
  labels: string[];
}

interface WeeklyData {
  week: number;
  value: number;
}

interface AllFarmsData {
  [key: string]: {
    totalOutput: number;
    weeklyOutputs: WeeklyData[];
  };
}

interface EquipmentList {
  [key: number]: string;
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

interface WeeklyCarbonCreditsPerFarm {
  week: number;
  values: {
    [key: string]: number;
  };
}

type Rewards = {
  amountInBucket: string;
  amountToDeduct: string;
  weekNumber: number;
}[]

export default function Farms({ labels }: FarmsProps) {
 
  const [weeklyFarmCounts, setWeeklyFarmCounts] = useState<number[]>([]);
  const [allFarmsData, setAllFarmsData] = useState<AllFarmsData>({});
  const [allFarmsWeeklyOutputs, setAllFarmsWeeklyOutputs] = useState<number[]>([]);
  const [ActiveFarmsCount, setActiveFarmCount] = useState<number>(0);
  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentDetails>({});
  const [equipmentList, setEquipmentList] = useState<EquipmentList>({});
  const [selectedFarm, setSelectedFarm] = useState<number>(0);
  const [farmStatus, setFarmStatus] = useState<boolean>(false);
  // TODO: Add carbon credits and rewards to the UI
  const [carbonCreditsByFarm, setCarbonCreditsByFarm] = useState<WeeklyCarbonCreditsPerFarm[]>([]);
  const [rewards, setRewards] = useState<Rewards>([]);

  const [mapZoom, setMapZoom] = useState<number>(4);
  const [dataLabels, setDataLabels] = useState<string[]>([]);
  const [weeklyOutputs, setWeeklyOutputs] = useState<number[]>([]);
  const weekCount = getWeeksSinceStart();

  const [selectedFarmLocation, setSelectedFarmLocation] = useState<string>('');
  const [selectedFarmWeather, setSelectedFarmWeather] = useState<WeatherData>();
  const [mapCenter, setMapCenter] = useState<{lat:number; lng:number}>({ lat: 38.794810, lng: -97.058722 });

  const key:string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';


  const dataPoints = selectedFarm ? weeklyOutputs : weeklyFarmCounts;

  const pastMonthFarms = weeklyFarmCounts ? 
  weeklyFarmCounts[weeklyFarmCounts.length - 1] - weeklyFarmCounts[weeklyFarmCounts.length - 5]
  : 0;

  const onboardingFarms = weeklyFarmCounts.length ? Number(weeklyFarmCounts[weeklyFarmCounts.length - 1]) - ActiveFarmsCount : 0;


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: key,
  });

  const weatherEmoji = selectedFarmWeather ? getWeatherEmoji(selectedFarmWeather) : '';

  // Get weekly outputs
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/api/weeklyOutput');
      
      const weeklyOutputs = await data.json();
      const allFarmsWeeklyOutputs = await weeklyOutputs.map((data: WeeklyData) => data.value / 1000000);
      setAllFarmsWeeklyOutputs(allFarmsWeeklyOutputs);
    };
    fetchData();
  }, []);

  // Get farm data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch('/api/farmData');
        const farmData = await data.json();
        
        setAllFarmsData(farmData)
      }
      catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  // Get carbon credits
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/carbonCredits');
      const res = await response.json();
      setCarbonCreditsByFarm(res.weeklyCarbonCreditsPerFarm);
    }
    try {
      fetchData();
    }
    catch (error) {
      console.error('Error fetching carbon credits:', error);
    }
  }, []);

  // Get rewards data
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/rewards');
      const res = await response.json();
      setRewards(res.rewards);
    }
    try {
      fetchData();
    }
    catch (error) {
      console.error('Error fetching carbon credits:', error);
    }
  }, []);

  // Get active farms count
  useEffect(() => {
    let count = 0;
    for (let farm in allFarmsData) {
      if (allFarmsData[farm].totalOutput > 0) {
        count++;
      }
    }
    setActiveFarmCount(count);
  }, [allFarmsData]);

    // Get weekly farm counts
    useEffect(() => {
      const fetchData = async () => {
        const data = await fetch('/api/farmCount');
        const weeklyFarmCount = await data.json();
        const weeklyFarmCountsDataPoints = await weeklyFarmCount.map((data: WeeklyData) => data.value);
        setWeeklyFarmCounts(weeklyFarmCountsDataPoints);
      };
      fetchData();
    }, [weekCount]);

  // Set WeeklyOutputs
  useEffect(() => {
    if (!allFarmsWeeklyOutputs) {
      return;
    }
    setWeeklyOutputs(allFarmsWeeklyOutputs);
    setDataLabels(labels);
  }, [allFarmsWeeklyOutputs, labels]);
  

  // Get location name and weather data for the selected farm
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
      const response = await fetch('api/equipmentData');
      const res = await response.json();
      const data = res.equipmentJson;
      setEquipmentDetails(data.EquipmentDetails);
      const parsedData = invertObject(data.EquipmentList);
      setEquipmentList(parsedData);
    }
    fetchData();
  }, []);

  // Set weeklyOutputs and labels
  useEffect(() => {
    const farmAddress = equipmentList[selectedFarm] ? equipmentList[selectedFarm] : 0;
    if (allFarmsData.hasOwnProperty(farmAddress)) {
      const outputs = allFarmsData[farmAddress].weeklyOutputs;

      setWeeklyOutputs(outputs.map((output:WeeklyData) => output.value / 1000000));
      const labels = outputs.map((output:WeeklyData) => `${output.week}`);
      labels.pop();
      setDataLabels(labels);
    }
  }, [allFarmsData, selectedFarm, equipmentList]);

  // get serial number from equipmentList, get output from allFarmsData
  // if output > 0, set status to active else onboarding
  useEffect(() => {
    if (selectedFarm) {
      const farmAddress = equipmentList[selectedFarm] ? equipmentList[selectedFarm] : 0;
      if (allFarmsData.hasOwnProperty(farmAddress)) {
        const outputs = allFarmsData[farmAddress].totalOutput;
        const status = outputs > 0;
        setFarmStatus(status);
      }
    }
  }, [equipmentList, selectedFarm, allFarmsData]);


  function handleFarmSelection(detail: Equipment) {
    setMapCenter({ lat: detail.Latitude, lng: detail.Longitude });
    setSelectedFarm(detail.ShortID);
    setMapZoom(7);
  }

  function handleResetFarmSelection() {
    setMapCenter({ lat: 38.794810, lng: -97.058722 } );
    setSelectedFarm(0);
    setWeeklyOutputs(allFarmsWeeklyOutputs);
    setDataLabels(labels);
    setMapZoom(4);
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
                  // (George) Keeping this code in case I need it later
                  // Define the default and selected icon properties
                  // const defaultIcon = {
                  //   url: 'default_marker_url', // URL to the default marker icon, optional if using text labels
                  //   scaledSize: new google.maps.Size(20, 20), // Default size, optional if using text labels
                  // };

                  // const selectedIcon = {
                  //   url: 'selected_marker_url', // URL to the selected marker icon, optional if using text labels
                  //   scaledSize: new google.maps.Size(30, 30), // Larger size, optional if using text labels
                  // };

                  // // Check if the current marker is the selected one
                  // const isMarkerSelected = detail.ShortID === selectedFarm;

                  // // Label for each marker based on ShortID. Convert to string if needed.
                  // const markerLabel = detail.ShortID.toString();

                  return (
                    <Marker
                      key={detail.ShortID}
                      position={{ lat: detail.Latitude, lng: detail.Longitude }}
                      onClick={() => handleFarmSelection(detail)}
                      // icon={isMarkerSelected ? selectedIcon : defaultIcon}
                      // label={markerLabel} // Set the label as the ShortID or any other numbering system you prefer
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
                  <StatusIndicator status={farmStatus} />
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
            {selectedFarm > 0 ? (<div id='top-values' className='flex flex-row'>
              <div className='w-4/12 flex flex-row justify-between'>
                <ChartCounter title="Location" value={selectedFarmLocation} />
                <div className='h-full w-px' style={{backgroundColor: "rgb(230,230,230"}}></div>
              </div>
              <div className='w-4/12 flex flex-row justify-between'>
                <ChartCounter title="Weather" value={weatherString} />
                <div className='h-full w-px' style={{backgroundColor: "rgb(230,230,230"}}></div>
              </div>
              <div className='w-4/12 flex flex-row justify-between'>
                <ChartCounter title={`Week ${weekCount} Output (so far)`} value={`${weeklyOutputs.length ? weeklyOutputs[weeklyOutputs.length - 1].toFixed(0) : ''} kWh`} />
              </div>
            </div>) :
            (<div id='top-values' className='flex flex-row'>
            <div className='w-4/12 flex flex-row justify-between'>
              <ChartCounter 
                title={"Active"} 
                value={ActiveFarmsCount}
              />
              <div className='h-full w-px' style={{backgroundColor: "rgb(230,230,230"}}></div>
            </div>
            <div className='w-4/12 flex flex-row justify-between'>
              <ChartCounter 
                title={"Onboarding"} 
                value={onboardingFarms}
              />
              <div className='h-full w-px' style={{backgroundColor: "rgb(230,230,230"}}></div>
            </div>
            <div className='w-4/12 flex flex-row justify-between'>
              <ChartCounter 
                title={"Past Month Increase"} 
                value={pastMonthFarms} 
                />
            </div>
          </div>
            )}


            <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
            <div className='pl-4 pb-2 pt-2 text-gray text-md'>
              {selectedFarm? "Weekly Power Output (in kWh)" : "Weekly Farm Count"}
            </div>
            <LineChart 
              title="" 
              labels={dataLabels} 
              dataPoints={dataPoints} 
            />
          </div>
              
        </div>

        {/* <div onClick={() => setSelectedFarm(Math.round(Math.random()*10) + 1)}>MOCK SELECT FARM</div> */}
    </>
  )
}

