import { NextResponse } from 'next/server';

export async function GET() {
  const parisTime = await fetch("http://worldtimeapi.org/api/timezone/Europe/Paris", {next: { revalidate: 10 }});
  const parisTimeJson = await parisTime.json();
  // const currentTime = new Date().toISOString();
  return NextResponse.json({parisTime: parisTimeJson.datetime});
}
