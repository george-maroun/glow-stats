import getWeeksSinceStart from '../../../../lib/utils/currentWeekHelper';
import { NextResponse } from 'next/server';
export const revalidate = 60;

const maxTimeslotOffset = getWeeksSinceStart();
const BASE_URL = process.env.FARM_STATS_URL || '';
const GCA_SERVER_URL = process.env.GCA_SERVER_URL || '';

type TProtocolFeesByFarm = {
  [key: string]: number;
};

const getRequestBody = (week:number) => ({
  urls: [GCA_SERVER_URL],
  week_number: week,
  with_full_data: false,
  include_unassigned_farms: false
});

const getProtocolFeesByFarm = async () => {
  const requestBody = getRequestBody(maxTimeslotOffset);

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const protocolFeesByFarm:TProtocolFeesByFarm = {};

    data.filteredFarms.forEach((farm:any) => {
      protocolFeesByFarm[farm.shortId] = farm.protocolFee;
    });

    return protocolFeesByFarm;
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    return [];
  }
}

export async function GET() {
  try {
    const protocolFeesByFarm = await getProtocolFeesByFarm();
    return NextResponse.json(protocolFeesByFarm);
  } catch (error) {
    console.error(`Error in GET handler: ${error}`);
    return NextResponse.json({ error: 'Failed to retrieve protocol fees by farm' }, { status: 500 });
  }
}
