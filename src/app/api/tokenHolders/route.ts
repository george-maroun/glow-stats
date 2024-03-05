import { NextResponse } from "next/server";
export const revalidate = 120;

import { CovalentClient } from "@covalenthq/client-sdk";

const ApiServices = async () => {
    const client = new CovalentClient(process.env.COVALENT_API_KEY as string);
    let count = 0;
    try {
        for await (const resp of client.BalanceService.getTokenHoldersV2ForTokenAddress("eth-mainnet","0xf4fbC617A5733EAAF9af08E1Ab816B103388d8B6", {"pageSize": 1000})) {
          count++;
        }
    } catch (error:any) {
        console.log(error.message);
    }
    return count;
}

export async function GET() {
  const tokenHolderCount = await ApiServices();

  return NextResponse.json({tokenHolderCount});
}