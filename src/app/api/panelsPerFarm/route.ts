import { NextResponse } from 'next/server';
export const revalidate = 60;

export async function GET() {
  const panelsPerFarm:any = {};
  try {
    const res = await fetch("https://www.glow.org/api/audits");
    const data = await res.json();
    const audits = data.audits;
    audits.forEach((audit:any) => {
      panelsPerFarm[audit.id] = audit.summary.solarPanels.quantity;
    });
    return NextResponse.json({panelsPerFarm: panelsPerFarm});
  }
  catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({panelsPerFarm: undefined});
  }
}

