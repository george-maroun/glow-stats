function extractCoordinates(coordinateString: string): { latitude: number, longitude: number } | null {
  // Regular expression to match the pattern
  const regex = /(-?\d+\.\d+)°\s*([NS])\s*,\s*(-?\d+\.\d+)°\s*([EW])/;
  
  // Try to match the string
  const match = coordinateString.match(regex);
  
  if (match) {
    // Extract values from the match
    const [, latValue, latDirection, lonValue, lonDirection] = match;
    
    // Convert to numbers
    let latitude = parseFloat(latValue);
    let longitude = parseFloat(lonValue);
    
    // Adjust for direction
    if (latDirection === 'S') latitude *= -1;
    if (lonDirection === 'W') longitude *= -1;
    
    return { latitude, longitude };
  }
  
  // Return null if no match found
  return { latitude: 0, longitude: 0 };
}

// Example usage
// const coordinateString = "40.68006° N, -111.80413° W";
// const result = extractCoordinates(coordinateString);

// if (result) {
//   console.log(`Latitude: ${result.latitude}, Longitude: ${result.longitude}`);
// } else {
//   console.log("Invalid coordinate string");
// }

export default extractCoordinates;