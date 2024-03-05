const getWeatherEmoji = (weatherData: any) => {
  const description = weatherData.weather[0].description;
  const cloudiness = weatherData.clouds.all;

  const weather = description.toLowerCase();
  if (weather.includes('cloud')) {
    if (cloudiness < 40) {
      return '🌤️';
    }
    if (cloudiness < 70) {
      return '⛅';
    }
    return '☁️';
  } else if (weather.includes('rain')) {
    return '🌧';
  } else if (weather.includes('sun')) {
    return '☀️';
  } else if (weather.includes('snow')) {
    return '❄️';
  } else {
    return '☀️';
  }
};

export default getWeatherEmoji;