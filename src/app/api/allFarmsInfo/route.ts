import { NextResponse } from 'next/server';
export const revalidate = 60;

// interface AllFarmsInfo {
//   []
// }

export async function GET() {
  const allFarmsInfo:any = {};
  try {
    const res = await fetch("https://www.glow.org/api/audits");
    const data = await res.json();
    const audits = data.audits;
    
    audits.forEach((audit:any) => {
      allFarmsInfo[audit.id] = {};
      allFarmsInfo[audit.id].panelCount = audit.summary.solarPanels.quantity;
      allFarmsInfo[audit.id].location = audit.summary.address.location;
      allFarmsInfo[audit.id].averageSunlightPerDay = audit.summary.carbonFootprintAndProduction.averageSunlightPerDay;
      allFarmsInfo[audit.id].protocolFee = audit.summary.carbonFootprintAndProduction.protocolFees;
    });

    return NextResponse.json({allFarmsInfo: allFarmsInfo});
  }
  catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({allFarmsInfo: undefined});
  }
}

