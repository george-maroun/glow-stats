const formatLocation = (location: string) => {
  if (!(location)) return 'Unavailable';

  const locationArr = location.split(',');
  const country = locationArr[locationArr.length - 1].trim();
  if (country === 'USA') {
    const city = locationArr[1].trim();
    const state = locationArr[2].trim().split(' ')[0];
    return `${city}, ${state}`;
  }

  const city = locationArr[locationArr.length - 2].trim();

  return `${city}, ${country}`;
}

export default formatLocation;