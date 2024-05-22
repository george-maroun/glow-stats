"use client"
import { useEffect, useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css'
import { Analytics } from '@vercel/analytics/react';
export const fetchCache = 'force-no-store';
export const dynamic = "force-dynamic";
import getWeeksSinceStart from '../../lib/utils/currentWeekHelper';
import ImpactCard from './components/ImpactCard';
import PowerCard from './components/PowerCard';
import TokenCard from './components/TokenCard';
import Farms from './components/Farms';
import FeesCard from './components/FeesCard';

export default function Home() {
  const [tokenHolderCount, setTokenHolderCount] = useState(0);
  const [tokenPriceContract, setTokenPriceContract] = useState(0);
  const [tokenPriceUniswap, setTokenPriceUniswap] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [labels, setLabels] = useState<string[]>([]);
  
  const [impactPowerOwners, setImpactPowerOwners] = useState<number>(0);
  const [impactPowerPrice, setImpactPowerPrice] = useState<number>(0);

  const [weeklyCarbonCredits, setWeeklyCarbonCredits] = useState<any[]>([]);
  const [weeklyFarmCount, setWeeklyFarmCount] = useState<any[]>([]);
  const [weeklyTotalOutput, setWeeklyTotalOutput] = useState<any[]>([]);
  const [weeklyDataByFarm, setWeeklyDataByFarm] = useState<any[]>([]);
  const [currentFarmIds, setCurrentFarmIds] = useState<number[]>([]);

  // Get all data
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/api/allData', { cache: 'no-store' });
      const allData = await data.json();
      // console.log(allData);
      setWeeklyCarbonCredits(allData.weeklyCarbonCredit);
      setWeeklyFarmCount(allData.weeklyFarmCount);
      setWeeklyTotalOutput(allData.weeklyTotalOutput);
      setWeeklyDataByFarm(allData.weeklyDataByFarm);
      setCurrentFarmIds(allData.currentFarmIds);
    };
    fetchData();
  }, []);

  // Get impact power owners
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/api/impactPowerOwners');
      const impactPowerOwners = await data.json();
      setImpactPowerOwners(impactPowerOwners.count);
    };
    fetchData();
  }, []);

  // Get impact power price
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/impactPowerPrice');
      const data = await res.json();
      setImpactPowerPrice(data.impactPowerPrice);
    };
    fetchData();
  }, []);

  // Get token holder count
  useEffect(() => {
    fetch('/api/tokenHolders')
      .then(res => res.json())
      .then(data => {
        setTokenHolderCount(data.tokenHolderCount);
      })
  }, []);

  // Get week count
  useEffect(() => {
    setWeekCount(getWeeksSinceStart());
  }, []);

  // Create labels
  useEffect(() => {
    const createLabels = () => {
      const weeks = weekCount;
      const labels = [];
      for (let i = 0; i <= weeks; i++) {
        labels.push(`${i}`);
      }
      return labels;
    }
    setLabels(createLabels());
  }, [weekCount]);

  // Get token price
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tokenPrice');
        const data = await response.json();
        setTokenPriceContract(data.tokenPriceContract / 10000);
        setTokenPriceUniswap(data.tokenPriceUniswap.toFixed(4));
      } catch (error) {
        console.error('Failed to fetch token prices:', error);
      }
    };
  
    fetchData();
  }, []);

  const carbonCredits = weeklyCarbonCredits.reduce((acc, curr) => acc + curr.value, 0).toFixed(3);

  return (
    <>
    <main className='w-full' style={{maxWidth: "1244px"}}> 
      <div className='mt-4 mb-4 text-md align-center flex flex-col lg:flex-row lg:gap-1' style={{color: "#777777"}}>
        <div className=''>Glow Stats is a community-built dashboard that aggregates metrics related to the <a className='underline' target="_blank" href='https://glowlabs.org/#about'>Glow Protocol</a>.</div>
      </div>
      <div 
        id='green-section' 
        className='lg:h-60 flex lg:flex-row justify-between lg:gap-0 flex-col mb-4 bg-[#A0DF01]' 
        style={{borderRadius: "0.75rem"}}
      >
        <div id='left-subsection' className='flex flex-col lg:w-6/12'>
          <div className='p-3 pb-1 grow max-w-xl flex flex-col justify-between lg:h-auto h-32'>
            <div className='text-2xl'>
              Carbon Credits Created
            </div>
            <div className='text-6xl' style={{color: "#374151"}}>
              {carbonCredits}
            </div>
          </div>
          <div className="h-px w-full bg-beige"></div>
          <div className='p-3 pb-1 grow max-w-xl flex flex-col justify-between lg:h-auto h-32'>
            <div className='text-2xl'>
              Impact Power Owners
            </div>
            <div className='text-6xl' style={{color: "#374151"}}>
              {impactPowerOwners}
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-beige lg:hidden"></div>
        <div className="w-px h-full bg-beige lg:visible"></div>
        <div id='right-subsection' className='flex lg:flex-row flex-col grow'>
          <div className='flex flex-col lg:w-6/12 w-full'>
            <div className='p-3 grow flex flex-col justify-between h-28'>
              <div className='font-semibold text-md'>
                GLW HOLDERS
              </div>
              <div className=' text-4xl' style={{color: "#374151"}}>
                {tokenHolderCount}
              </div>
            </div>
            <div className="h-px w-full bg-beige"></div>
            <div className='p-3 grow flex flex-col justify-between h-28'>
              <div className='font-semibold text-md'>
                IMPACT POWER PRICE
              </div>
              <div className=' text-4xl' style={{color: "#374151"}}>
                ${impactPowerPrice}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-beige lg:hidden"></div>
          <div className="w-px h-full bg-beige lg:visible"></div>

          <div className='flex flex-col grow'>
            <div className='p-3 grow flex flex-col justify-between h-28'>
              <div className='font-semibold text-md'>
                GLW PRICE (CONTRACT)
              </div>
              <div className=' text-4xl text-[#374151]'>
                ${tokenPriceContract}
              </div>
            </div>
            <div className="h-px w-full bg-beige"></div>
            <div className='p-3 grow flex flex-col justify-between h-28'>
              <div className='font-semibold text-md'>
                GLW PRICE (UNISWAP)
              </div>
              <div className=' text-4xl' style={{color: "#374151"}}>
                ${tokenPriceUniswap}
              </div>
            </div>
          </div>

        </div>
      </div>
      <div id='figures' className='flex lg:flex-row flex-col gap-2 lg:h-96'>
        <PowerCard weekCount={weekCount} weeklyTotalOutput={weeklyTotalOutput} labels={labels}/>
        <TokenCard />
      </div>

      <div id='divider' className='h-8'></div>
      <div id='divider' className='h-10'></div>
      <div className='text-4xl mb-8'>Explore Farms</div>

      
      <Farms 
        labels={labels.slice(0, labels.length - 1)} 
        weeklyFarmCount={weeklyFarmCount} 
        weeklyDataByFarm={weeklyDataByFarm}
        currentFarmIds={currentFarmIds}
      />
      <div id='divider' className='h-8'></div>

      <div id='divider' className='h-10'></div>
      <div className='text-4xl mb-8'>Protocol Statistics</div>

      <div className='mt-4 w-full flex lg:flex-row flex-col gap-2'>
        <div className='lg:w-6/12'>
           <ImpactCard carbonCredits={carbonCredits} weeklyCarbonCredits={weeklyCarbonCredits} />
        </div>

        <FeesCard />

      </div>
      

      
    </main>
    <Analytics />
    </>
  )
}
