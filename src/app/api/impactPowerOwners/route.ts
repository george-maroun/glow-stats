import { NextResponse } from 'next/server';
export const revalidate = 0;

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

    const data = await response.json();

    return NextResponse.json({count: data.data.users.length});
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json({count: undefined});
  }
}
