import getWeeksSinceStart from './currentWeekHelper';

async function fetchWeeklyData(startWeek=0, cb:Function) {
  const maxTimeslotOffset = getWeeksSinceStart();
  
  const weeklyData = [];
  const baseUrl = process.env.DEVICE_STATS_URL || '';

  for (let i = startWeek; i <= maxTimeslotOffset; i ++) {
    const timeSlotOffset = i * 2016;
    const url = baseUrl + timeSlotOffset;

    try {
        const response = await fetch(url);
        const data = await response.json();

        let totalData = cb(data);

        weeklyData.push({ week: i, value: totalData });
    } catch (error) {
        console.error('Error fetching data:', error);
        return;
    }
  }

  return weeklyData;
}

export default fetchWeeklyData;