import { NextResponse } from 'next/server';
export const revalidate = 0;
import { FarmInfo } from '../../types';

type AllFarmsInfo = Record<string, FarmInfo>;

export async function GET() {
  const allFarmsInfo:AllFarmsInfo = {};
  try {
    const res = await fetch("https://www.glow.org/api/audits");
    const data = await res.json();
    
    data.forEach((audit: any) => {
      allFarmsInfo[audit.id] = {
        farmName: audit.farmName,
        panelCount: audit.summary.solarPanels.quantity,
        location: audit.summary.address.location,
        coordinates: audit.summary.address.coordinates,
        averageSunlightPerDay: audit.summary.carbonFootprintAndProduction.averageSunlightPerDay,
        protocolFee: audit.summary.carbonFootprintAndProduction.protocolFees,
        activeShortIds: audit.activeShortIds
      };
    });

    return NextResponse.json({allFarmsInfo: allFarmsInfo});
  }
  catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({allFarmsInfo: undefined});
  }
}

