import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import getPlaceName from '../../../../lib/utils/getPlaceNameHelper'
export const revalidate = 60;

// type Param = number | string;

// // Helper function to fetch location data
// async function fetchLocationData(lat:Param, lon:Param) {
//   const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
//   const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json';
//   const url = `${baseURL}?latlng=${lat},${lon}&key=${API_KEY}`;
  
//   const locationData = await fetch(url);
//   if (!locationData.ok) {
//     throw new Error(`Error fetching location data: ${locationData.statusText}`);
//   }
//   return locationData.json();
// }

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const lat = searchParams.get('lat');
//     const lon = searchParams.get('lon');

//     if (!lat || !lon) {
//       throw new Error('Missing latitude or longitude parameters');
//     }

//     const locationJson = await fetchLocationData(lat, lon);

//     return NextResponse.json({ locationJson });
//   } catch (error: any) {
//     console.error(error); // Log the error for debugging
//     return NextResponse.json({ error: error.message }, { status: 500 }); // Return error response with status code 500
//   }
// }

const getFarmCoordinates = async () => {
  const farmCoordinates:any = {};
  try {
    const res = await fetch("https://www.glow.org/api/audits");
    const data = await res.json();
    const audits = data.audits;
    
    audits.forEach((audit:any) => {
      farmCoordinates[audit.id] = {};
      farmCoordinates[audit.id].panelCount = audit.summary.address.coordinates;
    });
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }

  return farmCoordinates;
}

const getLatLon = (coordinates: string) => {
  // Split the string by comma to separate latitude and longitude
  const parts = coordinates.split(', ');

  // Extract latitude and longitude values and remove the directional letters
  const lat = parseFloat(parts[0].replace('° N', ''));
  const lon = parseFloat(parts[1].replace('° W', ''));

  // Adjust the sign for the longitude as it is west
  const lonAdjusted = -lon;

  // Return the values as an array [lat, lon]
  return [lat, lonAdjusted];
};

export async function GET() {
  try {
    // Get the coordinates of all the farms from the audit api
    const farmCoordinates = await getFarmCoordinates();
    // Get the locations of all the farms from the db
    let farmLocations = await prisma.farmLocations.findMany({});
    // Compare the list of farms in the db and in the list returned from the audit api
    if (Object.keys(farmCoordinates).length !== Object.keys(farmLocations).length) {
      const farmIds = new Set(Object.keys(farmCoordinates));
      // for each farm that is not present in the db, get its location using the google api
      for (let id in farmLocations) {
        if (!farmIds.has(id)) {
          const [lat, lon] = getLatLon(farmCoordinates[id])
          const formattedLocation = getPlaceName(lat, lon);
          // add the new farms to the db
          await prisma.farmLocations.create({
            data: {
              farmId: id,
              location: formattedLocation
            },
          });
        }
      }
      // Get the locations of all the farms from the db
      farmLocations = await prisma.farmLocations.findMany({});
    }

    return NextResponse.json({ farmLocations });
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 500 }); // Return error response with status code 500
  }
}
