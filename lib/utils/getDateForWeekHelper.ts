  // Function to calculate the date for a given week number
  const getDateFromWeekNumber = (weekNumber: number) => {
    const genesisTimeInSeconds = 1700352000;
    const start = new Date(genesisTimeInSeconds * 1000);
    const date = new Date(start.getTime() + weekNumber * 7 * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  export default getDateFromWeekNumber;