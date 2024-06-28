async function fetchLocationData(lat: number, lon: number) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json';
  const url = `${baseURL}?latlng=${lat},${lon}&key=${API_KEY}`;
  
  const locationData = await fetch(url);
  if (!locationData.ok) {
    throw new Error(`Error fetching location data: ${locationData.statusText}`);
  }
  return locationData.json();
}


const getPlaceName = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetchLocationData(lat, lon);
    const data = await response.json();
    if (data.locationJson.status === 'OK') {
      const placeName = data.locationJson.results[0]?.formatted_address ?? 'Location name not found';
      return placeName;
    } else {
      console.error('Geocoding API error:', data.status);
      return 'Error fetching location name';
    }
  } catch (error) {
    console.error('Network error:', error);
    return 'Error fetching location name';
  }
};

export default getPlaceName;