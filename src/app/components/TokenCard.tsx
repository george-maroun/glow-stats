import React, { useEffect, useState } from 'react';
import LineChart from './LineChart';
import ChartCounter from './ChartCounter';

interface PriceData {
  date: string;
  price: number;
}

interface TokenStats {
  price: number;
  circulatingSupply: number;
  totalSupply: number;
  marketCap: number;
}

const TokenCard = () => {
  const [priceUniswapData, setPriceUniswapData] = useState<PriceData[]>([]);
  const [priceContractData, setPriceContractData] = useState<PriceData[]>([]);
  const [tokenStats, setTokenStats] = useState<TokenStats>({} as TokenStats);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/glowStats');
      const data = await res.json();
      setTokenStats(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/tokenPriceDaily');
      const data = await res.json();
      setPriceUniswapData(data.priceUniswapDaily);
      setPriceContractData(data.priceContractDaily);
    };

    fetchData();
  }, []);

  const totalSupply = Math.round(tokenStats.totalSupply || 0);
  const circSupply = Math.round(tokenStats.circulatingSupply || 0);
  const marketCap = Math.round(tokenStats.marketCap || 0);

  const uniswapLineColor = 'rgb(75, 192, 192)';
  const contractLineColor = 'rgb(34,197,94)';
  
  const labels = priceUniswapData.map((data: PriceData) => data.date.substring(8,10));
  const weeklyPriceUniswap = priceUniswapData.map((data: PriceData) => data.price);
  const weeklyFarmContract = priceContractData.map((data: PriceData) => data.price);

  return (
    <div id='right-figure' className='rounded-xl h-full lg:w-6/12 border' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
    <div className='p-4 pb-2 text-2xl'>
      Glow Token
    </div>
    <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
     
    <div id='top-values' className='flex flex-row'>
      <div className='w-4/12 flex flex-row justify-between'>
        <ChartCounter 
          title={"Total Supply"} 
          value={totalSupply ? totalSupply.toLocaleString() : ''}
        />
        <div className='h-full w-px' style={{backgroundColor: "rgb(230,230,230"}}></div>
      </div>
      <div className='w-4/12 flex flex-row justify-between'>
        <ChartCounter 
          title={"Circulating Supply"} 
          value={circSupply ? circSupply.toLocaleString() : ''}
        />
        <div className='h-full w-px' style={{backgroundColor: "rgb(230,230,230"}}></div>
      </div>
      <div className='w-4/12 flex flex-row justify-between'>
        <ChartCounter 
          title={"Market Cap"} 
          value={marketCap ? `$${(marketCap).toLocaleString()}` : ''} 
          />
      </div>
    </div>
    <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
    <div className='pl-4 pb-2 pt-2 pr-4 text-gray text-md flex flex-row justify-between items-center'>
      <div>Daily Price of GLW</div>
      
      <div className='flex flex-row items-center'>
       Uniswap
      <div className='w-3 h-1 ml-1.5 mr-4' style={{ backgroundColor: uniswapLineColor }}></div>
       Contract
      <div className='w-3 h-1 ml-1.5 mr-4' style={{ backgroundColor: contractLineColor}}></div>
      </div>
    </div>


      <LineChart 
        title="" 
        labels={labels} 
        dataPoints={weeklyPriceUniswap}
        dataPoints2={weeklyFarmContract} 
        color={uniswapLineColor}
        color2={contractLineColor}
        dataLabel={"Price"}
        dataLabel2={"Price"}
        interval='Date'
      />
    </div>
  );
}

export default TokenCard;



