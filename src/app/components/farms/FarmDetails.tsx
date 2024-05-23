// import React, { useState, useEffect, useMemo } from 'react';
// import LineChart from '../LineChart';
// import TopValues from '../TopValues';
// import StatusIndicator from '../StatusIndicator';
// import getPlaceName from '../../../../lib/utils/getPlaceNameHelper';
// import useWeather from '../../hooks/useWeather';
// import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';
// import getWeatherEmoji from '../../../../lib/utils/getWeatherEmojiHelper';
// import LineBarChart from '../LineBarChart';

// type IOutput = {
//   week: number;
//   value: number;
// }

// interface IFarmDetailsProps {
//   selectedFarm: number;
//   equipmentDetails: any; // Define a more specific type
//   weeklyFarmCount: Array<{ week: number; value: number }>;
//   weeklyDataByFarm: any; // Define a more specific type
//   handleResetFarmSelection: () => void;
// }

// interface ISelectedFarmData {
//   outputs: number[];
//   carbonCredits: number[];
//   tokenRewards: number[];
// }

// type TSelectedDataType = 'outputs' | 'carbonCredits' | 'tokenRewards';

// const FarmDetails: React.FC<IFarmDetailsProps> = (props) => {
//   const { 
//     selectedFarm, 
//     equipmentDetails,
//     weeklyFarmCount, 
//     weeklyDataByFarm,
//     handleResetFarmSelection 
//   } = props;

//   const [selectedDataType, setSelectedDataType] = useState<TSelectedDataType>('outputs');
//   const [dataLabels, setDataLabels] = useState<string[]>([]);
//   const [selectedFarmLocation, setSelectedFarmLocation] = useState<string>('');
//   const [selectedFarmData, setSelectedFarmData] = useState<ISelectedFarmData>({outputs: [], carbonCredits: [], tokenRewards: []});

//   const weekCount = getWeeksSinceStart();

//   // Get Weather
//   const lat = equipmentDetails[selectedFarm]?.Latitude;
//   const lon = equipmentDetails[selectedFarm]?.Longitude;
//   const { selectedFarmWeather } = useWeather(lat, lon);

//   const weeklyFarmCounts = weeklyFarmCount?.map((data: {week: number, value: number}) => data.value);

//   const labels = useMemo(() => Array.from({ length: weekCount + 1 }, (_, i) => `${i}`), [weekCount]);

//   const pastMonthFarms = weeklyFarmCounts.length ? 
//   weeklyFarmCounts[weeklyFarmCounts.length - 1] - weeklyFarmCounts[weeklyFarmCounts.length - 5]
//   : 0;

//   const ActiveFarmsCount = weeklyFarmCounts.length ? Number(weeklyFarmCounts[weeklyFarmCounts.length - 1]) : 0;
//   const onboardingFarms = '2';


//   const dataTypeName = {
//     outputs: ['Output', 'kWh'],
//     carbonCredits: ['Carbon Credits', ''],
//     tokenRewards: ['Token Rewards', 'GLW']
//   }


//   useEffect(() => {
//     const lat = equipmentDetails[selectedFarm]?.Latitude;
//     const lng = equipmentDetails[selectedFarm]?.Longitude;
//     if (lat && lng) {
//       getPlaceName(lat, lng).then((locationName) => {
//         const locArr = locationName.split(',');
//         const city = locArr[1].trim();
//         const state = locArr[2].trim().split(' ')[0];
//         locationName = `${city}, ${state}`
//         setSelectedFarmLocation(locationName);
//       });
//     }
//   }, [selectedFarm, equipmentDetails])


// const getFilteredValues = (data:any, key:any) => {
//   if (!data) return [];

//   const values = data[key]?.map((item:any) => item.value) || [];
//   const firstNonZeroIndex = values.findIndex((value:any) => value !== 0);
//   return values.slice(firstNonZeroIndex);
// };

// const getFilteredLabels = (data:any) => {
//   if (!data) return [];

//   const firstNonZeroIndex = data.findIndex((item:any) => item.value !== 0);
//   return data.slice(firstNonZeroIndex).map((item:any) => `${item.week}`);
// };

// useEffect(() => {
//   const selectedFarmData = weeklyDataByFarm[selectedFarm];

//   if (selectedFarmData) {
//     const outputs = getFilteredValues(selectedFarmData, 'powerOutputs');
//     const carbonCredits = getFilteredValues(selectedFarmData, 'carbonCredits');
//     const weeklyTokenRewards = getFilteredValues(selectedFarmData, 'weeklyTokenRewards');

//     setSelectedFarmData({
//       outputs,
//       carbonCredits,
//       tokenRewards: weeklyTokenRewards
//     });

//     const labels = getFilteredLabels(selectedFarmData.powerOutputs);
//     setDataLabels(labels);
//   }
// }, [weeklyDataByFarm, selectedFarm, selectedDataType]);



//   const DataTypeSelector = ({ onChange }: { onChange: (type: string) => void }) => {
//     return (
//       <select onChange={e => onChange(e.target.value)} value={selectedDataType}>
//         <option value="outputs">Weekly Power Output (in kWh)</option>
//         <option value="carbonCredits">Weekly Carbon Credits</option>
//         <option value="tokenRewards">Weekly Token Rewards (in GLW)</option>
//       </select>
//     );
//   }

//   const getWeatherString = () => {
//     const weatherEmoji = selectedFarmWeather ? getWeatherEmoji(selectedFarmWeather) : '';
//     return selectedFarmWeather ? `${weatherEmoji} ${selectedFarmWeather?.main.temp.toFixed(1)}°F` : '';
//   }

//   const getLatestWeekDataPoint = () => {
//     if (!selectedFarmData[selectedDataType]?.length) {
//       return '';
//     }
//     const latestWeekDataPoint = selectedFarmData[selectedDataType][selectedFarmData[selectedDataType].length - 1];
//     let value;
//     if (selectedDataType === 'carbonCredits') {
//       value = latestWeekDataPoint.toFixed(3);
//     } else {
//       value = latestWeekDataPoint.toFixed(0).toLocaleString();
//     }
    
//     return `${value} ${dataTypeName[selectedDataType][1]}`;
//   }

//   return (
//     <div id='right-figure' className='rounded-xl lg:h-full h-auto lg:w-6/12 border' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
//       <div className='p-4 pb-2 text-2xl flex flex-row justify-between items-center'>
//         <div>{selectedFarm ? 
//           (<div className='flex flex-row gap-4 items-center'>
//             <div>
//               {`Farm ${selectedFarm}`}
//             </div>
//             <StatusIndicator status={true} />
//           </div>) 
//           :  
//           "Farms"}
//         </div>
//         {selectedFarm > 0 ? (
//           <div onClick={handleResetFarmSelection} className='pl-4 pb-0 p-1 text-gray text-base cursor-pointer underline decoration-1 underline-offset-1'>
//             Back to all farms
//           </div>
//         ) : (
//           <div className='pl-4 pb-0 p-1 text-gray opacity-60 text-right italic text-base text-italic underline-offset-1'>
//             Click on a pin to view farm details
//           </div>
//         )}
//       </div>
//       <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>

//     {selectedFarm > 0 ? 
//       (<TopValues 
//         title1='Location' 
//         value1={selectedFarmLocation}
//         title2='Weather'
//         value2={getWeatherString()}
//         title3={`Week ${weekCount} ${dataTypeName[selectedDataType][0]} (so far)`}
//         value3={getLatestWeekDataPoint()}
//         />) :
//       (<TopValues 
//         title1='Active' 
//         value1={ActiveFarmsCount}
//         title2='Onboarding'
//         value2={onboardingFarms}
//         title3={"Past Month Increase"}
//         value3={weeklyFarmCounts.length ? pastMonthFarms.toString() : 0}
//         />
//       )}

//       <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
//       <div className='pl-4 pb-2 pt-2 text-gray text-md'>
//       {selectedFarm ? (
//         <>
//           <DataTypeSelector onChange={(type: any) => setSelectedDataType(type)} />
//           {selectedDataType === 'tokenRewards' ? (
//             <LineBarChart 
//               title="" 
//               labels={dataLabels} 
//               dataPoints={selectedFarmData[selectedDataType]} 
//             />
//           ) : (
//             <LineChart 
//               title="" 
//               labels={dataLabels} 
//               dataPoints={selectedFarmData[selectedDataType]} 
//             />
//           )}
//         </>
//       ) : (
//         <>
//           <div>Weekly Farm Count</div>
//           <LineChart 
//             title="" 
//             labels={labels} 
//             dataPoints={weeklyFarmCounts} 
//           />
//         </>
//       )}

//       </div>
//     </div>
//   )
// }

// export default FarmDetails;


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
  handleResetFarmSelection
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

