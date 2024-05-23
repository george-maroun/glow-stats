"use client"

import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import useEquipmentDetails from '../../hooks/useEquipment';
import { Equipment } from '../../hooks/useEquipment';
import FarmDetails from './FarmDetails';
import { IWeeklyDataByFarm } from '../../types';

import 'react-tooltip/dist/react-tooltip.css'
export const fetchCache = 'force-no-store';
export const dynamic = "force-dynamic";


interface FarmsProps {
  labels: string[];
  weeklyFarmCount: {week: number, value: number}[];
  weeklyDataByFarm: IWeeklyDataByFarm;
  currentFarmIds: number[];
}

export default function Farms({ weeklyFarmCount, weeklyDataByFarm, currentFarmIds }: FarmsProps) {
  const { equipmentDetails } = useEquipmentDetails(currentFarmIds);

  const [selectedFarm, setSelectedFarm] = useState<number>(0);

  const [mapCenter, setMapCenter] = useState<{lat:number; lng:number}>({ lat: 38.794810, lng: -97.058722 });
  const [mapZoom, setMapZoom] = useState<number>(4);
  const key:string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: key,
  });

  function handleFarmSelection(detail: Equipment) {
    setMapCenter({ lat: detail.Latitude, lng: detail.Longitude });
    setSelectedFarm(detail.ShortID);
    setMapZoom(prev => 7);
  }

  function handleResetFarmSelection() {
    setMapCenter({ lat: 38.794810, lng: -97.058722 } );
    setSelectedFarm(0);
    setMapZoom(prev => 4);
  }

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '12px',
  };

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

        <FarmDetails
          selectedFarm={selectedFarm}
          equipmentDetails={equipmentDetails}
          weeklyFarmCount={weeklyFarmCount}
          weeklyDataByFarm={weeklyDataByFarm}
          handleResetFarmSelection={handleResetFarmSelection}
        />
      </div>

      <div onClick={() => setSelectedFarm([60,26,19,65][Math.floor(Math.random()*4)])}>MOCK SELECT FARM</div>
    </>
  )
}

