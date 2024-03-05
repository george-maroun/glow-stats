import { NextResponse } from 'next/server';
export const revalidate = 60;

const GRAPHQL_QUERY = {
  query: `
    {
      protocolFeePaymentsPerWeeks(
        orderBy: totalPayments
        first: 1000
        orderDirection: desc
      ) {
          id
          totalPayments
      }
    }
  `
};

interface ProtocolFeePayment {
  id: string;
  totalPayments: string;
}

function sortProtocolFeePaymentsDesc(data: ProtocolFeePayment[]): ProtocolFeePayment[] {
  return data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
}

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || '';

export async function GET() {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(GRAPHQL_QUERY),
  });

  const data = await response.json();
  sortProtocolFeePaymentsDesc(data.data.protocolFeePaymentsPerWeeks);

  return NextResponse.json({protocolFeesPerWeek: data.data.protocolFeePaymentsPerWeeks});
}
