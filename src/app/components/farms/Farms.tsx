"use client"
import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import useEquipmentDetails from '../../hooks/useEquipment';
import { Equipment } from '../../hooks/useEquipment';
import FarmDetails from './FarmDetails';
import FarmList from './FarmList'; // Import the new FarmList component
import { IWeeklyDataByFarm } from '../../types';

import 'react-tooltip/dist/react-tooltip.css'
export const fetchCache = 'force-no-store';
export const dynamic = "force-dynamic";

interface FarmsProps {
  labels: string[];
  weeklyFarmCount: { week: number, value: number }[];
  weeklyDataByFarm: IWeeklyDataByFarm;
  weeklySolarPanelCount: { week: number, value: number }[];
  currentFarmIds: number[];
}

export default function Farms({ weeklyFarmCount, weeklyDataByFarm, currentFarmIds, weeklySolarPanelCount }: FarmsProps) {
  const { equipmentDetails } = useEquipmentDetails(currentFarmIds);

  const [selectedFarm, setSelectedFarm] = useState<number>(0);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 38.794810, lng: -97.058722 });
  const [mapZoom, setMapZoom] = useState<number>(4);
  const [view, setView] = useState<string>('map'); // State to manage the selected view
  const [protocolFeesByFarm, setProtocolFeesByFarm] = useState<{[key: string]: number;} | null>(null);
  const [farmLocations, setFarmLocations] = useState<any>(null);

  useEffect(() => {
    const getFarmLocations = async () => {
      try {
        const response = await fetch('api/locationData');
        const locations = await response.json();
        setFarmLocations(locations.farmLocations);
      } catch (err) {
        console.error(err);
      }
    };
    getFarmLocations();
  }, []);


  useEffect(() => {
    const getProtocolFeesByFarm = async () => {
      let protocolFees = {};
      try {
        const response = await fetch('api/protocolFeesByFarm');
        const res = await response.json();
        protocolFees = res;
      } catch (err) {
        console.error(err);
      }
      setProtocolFeesByFarm(protocolFees);
    };
    getProtocolFeesByFarm();
  }, []);

  const key:string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: key,
  });

  useEffect(() => {
    if (selectedFarm === 0) {
      return;
    }
    setMapZoom(prev => 7);
  }, [selectedFarm]);

  function handleFarmSelection(detail: Equipment) {
    setMapCenter({ lat: detail.Latitude, lng: detail.Longitude });
    setSelectedFarm(detail.ShortID);
    setMapZoom(3);
  }

  function handleResetFarmSelection() {
    setMapCenter({ lat: 38.794810, lng: -97.058722 });
    setSelectedFarm(0);
    setMapZoom(3);
  }

  const mapContainerStyle = {
    width: '100%',
    height: '380px',
    borderRadius: '12px',
  };

  return (
    <>
      <div>
        <button
          className={`px-4 w-16 py-2 border-y border-l rounded-l-lg`}
          style={{backgroundColor: `${view === 'map' ? '#f7f7f7' : 'white'}`, borderColor: 'rgb(220,220,220)'}}
          onClick={() => setView(prev => 'map')}
        >
          Map
        </button>
        <button
          className={`px-4 w-16 py-2 border ${view === 'list' ? 'bg-gray-300' : 'bg-white'} rounded-r-lg`}
          style={{backgroundColor: `${view === 'list' ? '#f7f7f7' : 'white'}`, borderColor: 'rgb(220,220,220)'}}
          onClick={() => setView(prev => 'list')}
        >
          List
        </button>
      </div>

      <div id='figures' className='flex lg:flex-row flex-col gap-2 lg:h-96 mt-4'>
        <div id='left-figure' className='rounded-xl lg:h-full lg:w-6/12 border' style={{ backgroundColor: "white", borderColor: "rgb(220,220,220)" }}>
          {view === 'map' && isLoaded && (
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
          {view === 'list' && (
            <FarmList
              equipmentDetails={equipmentDetails}
              handleSelectFarm={setSelectedFarm}
              protocolFeesByFarm={protocolFeesByFarm}
              selectedFarm={selectedFarm}
              farmLocations={farmLocations}
            />
          )}
        </div>

        <FarmDetails
          selectedFarm={selectedFarm}
          equipmentDetails={equipmentDetails}
          weeklyFarmCount={weeklyFarmCount}
          weeklyDataByFarm={weeklyDataByFarm}
          weeklySolarPanelCount={weeklySolarPanelCount}
          handleResetFarmSelection={handleResetFarmSelection}
          farmLocations={farmLocations}
        />
      </div>
    </>
  )
}
