import { useState, useEffect } from 'react';

type WeatherData = {
  main: {
    temp: number;
  },
  weather: [{
    description: string;
  }],
  name: string;
};

const useWeather = (latitude: number, longitude: number) => {

  const [selectedFarmWeather, setSelectedFarmWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<any>(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchWeather = async () => {
      const url = `/api/weatherData?lat=${latitude}&lon=${longitude}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        
        const data = await response.json();
        setSelectedFarmWeather(data.weatherJson);
      } catch (err) {
        setWeatherError(err);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { selectedFarmWeather, weatherError };
};

export default useWeather;
