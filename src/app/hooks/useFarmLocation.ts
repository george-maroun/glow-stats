import { useState, useEffect } from 'react';
import getPlaceName from '../../../lib/utils/getPlaceNameHelper';

const useFarmLocation = (selectedFarm: number, equipmentDetails: any) => {
  const [selectedFarmLocation, setSelectedFarmLocation] = useState<string>('');

  useEffect(() => {
    const lat = equipmentDetails[selectedFarm]?.Latitude;
    const lng = equipmentDetails[selectedFarm]?.Longitude;
    if (lat && lng) {
      getPlaceName(lat, lng).then((locationName) => {
        const locArr = locationName.split(',');
        const city = locArr[1].trim();
        const state = locArr[2].trim().split(' ')[0];
        locationName = `${city}, ${state}`;
        setSelectedFarmLocation(locationName);
      });
    }
  }, [selectedFarm, equipmentDetails]);

  return selectedFarmLocation;
};

export default useFarmLocation;
