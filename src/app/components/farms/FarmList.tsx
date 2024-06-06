import React, { useState, useEffect } from "react";
import farmLocations from "./locationsTemp";

type FarmListProps = {
  equipmentDetails: any;
  handleSelectFarm: (farm: number) => void;
  protocolFeesByFarm: {[key: string]: number} | null;
  selectedFarm: number;
}

const getfarmLocation = (farmId: string) => {
  if (!(farmId in farmLocations)) return ('USA');

  const rawLocation = farmLocations[farmId];
  const locationArr = rawLocation.split(',');
  const city = locationArr[1].trim();
  const state = locationArr[2].trim().split(' ')[0];

  return `${city}, ${state}`;
}

const FarmList = ({equipmentDetails, handleSelectFarm, protocolFeesByFarm, selectedFarm }: FarmListProps) => {
  const [hoveredFarm, setHoveredFarm] = useState<number | null>(null);

  function listFarms() {
    return (
      <div>
        {Object.keys(equipmentDetails).map((farmId, index) => {
          return (
            <div 
              key={index} 
              onClick={() => handleSelectFarm(Number(farmId))}
              className="transition duration-200 ease-in-out"
              onMouseEnter={() => setHoveredFarm(Number(farmId))}
              onMouseLeave={() => setHoveredFarm(null)}
              style={{
                backgroundColor: selectedFarm === Number(farmId) 
                  ? "rgb(240,240,240)" 
                  : (hoveredFarm === Number(farmId) ? "rgb(250,250,250)" : "white"),
                cursor: "pointer",
              }}
            >
              <div 
                className='flex flex-row justify-start py-2'
              >
                <div className='pl-4 text-gray text-md w-3/12'>
                  {farmId}
                </div>
                <div className='pl-4 text-gray text-md w-5/12'>
                  {getfarmLocation(farmId)}
                </div>
                <div className='pl-4 text-gray text-md w-4/12'>
                  {protocolFeesByFarm ? protocolFeesByFarm[farmId].toFixed(2).toLocaleString() : ""}
                </div>
              </div>
              <div className='h-px w-full' style={{backgroundColor: "rgb(240,240,240"}}></div>
            </div>
          );
        })}
      </div>
    );
  }


  return (
    <div>
      <div className='p-4 pb-2 text-2xl'>
        Farm List
      </div>
      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div className='flex flex-row justify-start mt-1 mb-2'>
        <div className='pl-4 pb-0 p-1 text-gray text-md w-3/12'>
          Farm ID
        </div>
        <div className='pl-4 pb-0 p-1 text-gray text-md w-5/12'>
          Location
        </div>
        <div className='pl-4 pb-0 p-1 text-gray text-md w-4/12'>
          Protocol Fee (USD)
        </div>
      </div>
      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div className='lg:h-64 h-44 overflow-y-auto mb-2' style={{height: '272px'}}>
        {Object.keys(equipmentDetails).length > 0 ? listFarms() : <div className='p-4 '>Loading...</div>}
      </div>
    </div>
  );
}

export default FarmList;