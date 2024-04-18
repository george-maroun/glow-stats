import React, { useEffect, useState } from 'react';
import LineChart from './LineChart';
import ChartCounter from './ChartCounter';


interface PriceData {
  date: number;
  price: string;
}

interface TokenStats {
  price: number;
  circulatingSupply: number;
  totalSupply: number;
  marketCap: number;
}

interface Period {
  '1D': boolean;
  '1W': boolean;
  '1M': boolean;
  '3M': boolean;
  '1Y': boolean;
  'Max': boolean;
}

const getISODateFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp*1000);
  const formattedDate = date.toISOString();
  return formattedDate;
}

const TokenCard = () => {
  const [glowPriceData, setGlowPriceData] = useState<PriceData[]>([]);
  const [tokenStats, setTokenStats] = useState<TokenStats>({} as TokenStats);
  const [period, setPeriod] = useState<Period>({ '1D': false, '1W': false, '1M': false, '3M': false, '1Y': false, 'Max': true });
  const [labels, setLabels] = useState<string[]>([]);
  const [priceDataPoints, setPriceDataPoints] = useState<number[]>([]);

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
      setGlowPriceData(data.glowDailyPrice);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let labels: string[] = [];
    let priceDataPoints: number[] = [];
    let priceSlice: PriceData[] = [];
  
    const getSlicedData = (dataCount:number): PriceData[] => {
      const dataSlice: PriceData[] = [];

      let dataFrequency;
      dataFrequency = Math.max(Math.round(glowPriceData.length / 50), 1);

      for (let i = Math.max(glowPriceData.length - dataCount, 0); i < glowPriceData.length; i += dataFrequency) {
        dataSlice.push(glowPriceData[i]);
      }
      return dataSlice;
    }
  
    // Price is recorded every hour
    if (period['1D']) {
      priceSlice = glowPriceData.slice(-12);
    } else if (period['1W']) {
      priceSlice = getSlicedData(7 * 24);
    } else if (period['1M']) {
      priceSlice = getSlicedData(30 * 24);
    } else if (period['3M']) {
      priceSlice = getSlicedData(90 * 24);
    } else if (period['1Y']) {
      priceSlice = getSlicedData(365 * 24);
    } else if (period['Max']) {
      priceSlice = getSlicedData(glowPriceData.length);
    }
    if (period['1D']) {
      labels = priceSlice.map(data => getISODateFromTimestamp(data.date).substring(11,16));
    } else {
      labels = priceSlice.map(data => getISODateFromTimestamp(data.date).substring(5,10));
    }
    
    priceDataPoints = priceSlice.map(data => Number(data.price));
  
    setLabels(labels);
    setPriceDataPoints(priceDataPoints);
  }, [glowPriceData, period]);
  


  const totalSupply = Math.round(tokenStats.totalSupply || 0);
  const circSupply = Math.round(tokenStats.circulatingSupply || 0);
  const marketCap = Math.round(tokenStats.marketCap || 0);

  return (
    <div id='right-figure' className='rounded-xl h-full lg:w-6/12 border' style={{backgroundColor: "white", borderColor: "rgb(220,220,220)"}}>
    <div className='flex flex-row justify-between items-center'>
      <div className='p-4 pb-2 text-2xl'>Glow Token</div>
      <a 
      href='https://app.glow.org/' 
      target='_blank' 
      className='text-gray underline p-4 pb-2'
      >
        Buy $GLW 
      </a>
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
      
      <div className='flex flex-row gap-3 text-sm'>
        {Object.keys(period).map((key) => {
          const periodKey = key as keyof Period;
          return (
            <button 
              key={key}
              className={`${period[periodKey] ? "text-[#000000]" : "text-[#777777]"}`}
              onClick={() => {
                const newPeriod = Object.fromEntries(Object.keys(period).map((k:any) => [k, k === key]));
                setPeriod(newPeriod);
              }}
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>


      <LineChart 
        title="" 
        labels={labels} 
        dataPoints={priceDataPoints}
        dataLabel={"Price"}
        dataLabel2={"Price"}
        interval={period['1D'] ? 'Time' : 'Date'}
      />
    </div>
  );
}

export default TokenCard;



