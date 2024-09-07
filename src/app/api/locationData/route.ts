import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import getPlaceName from '../../../../lib/utils/getPlaceNameHelper'
export const revalidate = 7200;

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
    const url = process.env.EQUIPMENT_STATS_URL || '';

    const equipmentData = await fetch(url);
    const equipmentJson = await equipmentData.json();

    if (!equipmentData.ok) {
      throw new Error(`Error fetching equipment data: ${equipmentData.statusText}`);
    }

    const equipmentDetails = equipmentJson.EquipmentDetails;

    Object.values(equipmentDetails).forEach((equipment:any) => {
      farmCoordinates[equipment.ShortID] = [equipment.Latitude, equipment.Longitude];
    });

  } catch (error:any) {
    console.error(error); // Log the error for debugging
  }

  return farmCoordinates;
}

// const getLatLon = (coordinates: string) => {
//   const parts = coordinates.split(', ');
//   const lat = parseFloat(parts[0].replace('° N', ''));
//   const lon = parseFloat(parts[1].replace('° W', ''));
//   if (lon > 0) return [lat, -lon];

//   return [lat, lon];
// };

export async function GET() {
  try {
    // Get the coordinates of all the farms from the audit api
    const farmCoordinates = await getFarmCoordinates();
    // Get the locations of all the farms from the db
    let farmLocations = await prisma.farmLocations.findMany({});

    // Compare the list of farms in the db and in the list returned from the audit api
    if (Object.keys(farmCoordinates).length !== farmLocations.length) {
      const farmIds = new Set(farmLocations.map((farm) => farm.farmId));
      // for each farm that is not present in the db, get its location using the google api
      for (let id in farmCoordinates) {
        if (farmIds.has(Number(id))) {
          continue;
        }
        const [lat, lon] = farmCoordinates[id];

        const formattedLocation = await getPlaceName(lat, lon);
        // add the new farms to the db
        await prisma.farmLocations.create({
          data: {
            farmId: Number(id),
            location: formattedLocation
          },
        });
      }
      // Get the locations of all the farms from the db
      farmLocations = await prisma.farmLocations.findMany({});
    }

    const locationsObj:any = {};
    farmLocations.forEach((farm) => {
      locationsObj[farm.farmId] = farm.location;
    });

    return NextResponse.json({ farmLocations: locationsObj });
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 500 }); // Return error response with status code 500
  }
}
