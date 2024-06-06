import { NextResponse } from 'next/server';
export const revalidate = 3600;

import prisma from '../../../../lib/prisma';

// export default async function handle(req, res) {
//   const { title, content } = req.body;

//   const session = await getSession({ req });
//   const result = await prisma.post.create({
//     data: {
//       title: title,
//       content: content,
//       author: { connect: { email: session?.user?.email } },
//     },
//   });
//   res.json(result);
// }



type Param = number | string;

// Helper function to fetch location data
async function fetchLocationData(lat:Param, lon:Param) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json';
  const url = `${baseURL}?latlng=${lat},${lon}&key=${API_KEY}`;
  
  const locationData = await fetch(url);
  if (!locationData.ok) {
    throw new Error(`Error fetching location data: ${locationData.statusText}`);
  }
  return locationData.json();
}

const getFarmLocations = async () => {
  const url = process.env.EQUIPMENT_STATS_URL || '';

  const equipmentData = await fetch(url);
  const equipmentJson = await equipmentData.json();
  const equipmentDetails = equipmentJson.EquipmentDetails;

  const farmLocations:any = {};

  for (let farm in equipmentDetails) {
    const locationData = await fetchLocationData(equipmentDetails[farm].Latitude, equipmentDetails[farm].Longitude);
    farmLocations[farm] = farmLocations[farm] = locationData.results[0]?.formatted_address ?? 'Location name not found';;
  }
  
  return farmLocations;
}

export async function GET() {
  try {
    const farmLocations = await getFarmLocations();
    return NextResponse.json(farmLocations);
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 500 }); // Return error response with status code 500
  }
}
