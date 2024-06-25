import Web3 from "web3";
import { NextResponse } from "next/server";
export const revalidate = 60;
import { glowContractABI } from "../../../../constants/abis/glow.abi";
import { usdgGlwPairABI } from "../../../../constants/abis/usdgGlwPair.abi";


const GLOW_ADDRESS = '0xD5aBe236d2F2F5D10231c054e078788Ea3447DFc';

interface Reserves {
  '0': bigint,
  '1': bigint,
  '2': bigint,
  __length__: number,
  _reserve0: bigint,
  _reserve1: bigint,
  _blockTimestampLast: bigint
}


async function fetchGlowPriceFromContract() {
  try {
    const web3 = new Web3(process.env.INFURA_URL as string); // Replace with your node URL
    const contract = new web3.eth.Contract(glowContractABI, GLOW_ADDRESS);

    try {
      const price = await contract.methods.getCurrentPrice().call();
      return Number(price);
    } catch (error) {
      console.error('Error fetching price:');
      throw error; // Or handle the error gracefully
    }
  }
  catch (error) {
    console.error('Error connecting to the node:');
    return // Or handle the error gracefully
  }
}

async function fetchGlowPriceFromUniswap() {
  try {
    const web3 = new Web3(process.env.INFURA_URL as string); // Replace with your node URL

    const contract = new web3.eth.Contract(usdgGlwPairABI, "0x6FA09ffC45F1dDC95c1bc192956717042f142c5d");

    try {
      const reserves = await contract.methods.getReserves().call() as Reserves;
      const price = Number(BigInt(1e18) * reserves._reserve0 / reserves._reserve1) / 1e6;
      return price;
    } catch (error) {
      console.error('Error fetching price:');
      throw error; // Or handle the error gracefully
    }
  }
  catch (error) {
    console.error('Error connecting to the node:');
    return // Or handle the error gracefully
  }
}



export async function GET() {
  const tokenPriceContract = await fetchGlowPriceFromContract();
  const tokenPriceUniswap = await fetchGlowPriceFromUniswap();

  return NextResponse.json({ tokenPriceContract, tokenPriceUniswap });
}