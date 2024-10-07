const formatLocation = (location: string) => {
  if (!(location)) return 'India';

  const locationArr = location.split(',');
  if (locationArr.length < 4) return 'USA';

  const city = locationArr[1].trim();
  const state = locationArr[2].trim().split(' ')[0];

  return `${city}, ${state}`;
}

export default formatLocation;