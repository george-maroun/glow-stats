// Import necessary modules
import { NextResponse } from 'next/server';
export const revalidate = 60;

const GRAPHQL_QUERY = {
  query: `
    {
      users(
        orderBy: totalImpactPoints
        orderDirection: desc
        first: 1000
        where: { totalImpactPoints_gt: 0 }
      ) {
        id
        totalImpactPoints
      }
    }
  `
};

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || '';


export async function GET() {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(GRAPHQL_QUERY),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const impactPowerCount = data.data.users.reduce((acc: number, user: any) => acc + parseInt(user.totalImpactPoints), 0);
    return NextResponse.json({impactPowerCount});
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json({impactPowerCount: undefined});
  }
}