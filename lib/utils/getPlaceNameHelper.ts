const getPlaceName = async (lat: number, lon: number): Promise<string> => {
  const url = `/api/locationData?lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(url);
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