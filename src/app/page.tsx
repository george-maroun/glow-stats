"use client"
import { useMemo, useEffect, useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css'
import { Analytics } from '@vercel/analytics/react';
export const fetchCache = 'force-no-store';
export const dynamic = "force-dynamic";
import getWeeksSinceStart from '../../lib/utils/currentWeekHelper';
import ImpactCard from './components/ImpactCard';
import PowerCard from './components/PowerCard';
import TokenCard from './components/TokenCard';
import Farms from './components/farms/Farms';
import FeesCard from './components/FeesCard';
import TokenStats from './components/TokenStats';
import FAQ from './components/faq';
import { FarmsInfoContext } from './providers/allFarmsInfoProvider';
import { FarmInfo } from './types';


export default function Home() {
  const [tokenHolderCount, setTokenHolderCount] = useState(0);
  const [tokenPriceContract, setTokenPriceContract] = useState(0);
  const [tokenPriceUniswap, setTokenPriceUniswap] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [labels, setLabels] = useState<string[]>([]);
  
  const [impactPowerOwners, setImpactPowerOwners] = useState<number>(0);
  const [impactPowerPrice, setImpactPowerPrice] = useState<number>(0);
  const [tokenStats, setTokenStats] = useState<any>({});

  const [weeklyCarbonCredits, setWeeklyCarbonCredits] = useState<any[]>([]);
  const [weeklyFarmCount, setWeeklyFarmCount] = useState<any[]>([]);
  const [weeklyTotalOutput, setWeeklyTotalOutput] = useState<any[]>([]);
  const [weeklyDataByFarm, setWeeklyDataByFarm] = useState<any[]>([]);
  const [currentFarmIds, setCurrentFarmIds] = useState<number[]>([]);

  const [allFarmsInfo, setAllFarmsInfo] = useState<Record<string, FarmInfo>>({});
    // Add loading states
  const [isLoading, setIsLoading] = useState({
    allData: true,
    tokenStats: true,
    allFarmsInfo: true,
    impactPowerOwners: true,
    impactPowerPrice: true,
    tokenHolders: true,
    tokenPrice: true
  });

  // Get all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch('/api/allData');
        const allData = await data.json();
        setWeeklyCarbonCredits(allData.weeklyCarbonCredit || []);
        setWeeklyFarmCount(allData.weeklyFarmCount || []);
        setWeeklyTotalOutput(allData.weeklyTotalOutput || []);
        setWeeklyDataByFarm(allData.weeklyDataByFarm || []);
        setCurrentFarmIds(allData.currentFarmIds || []);
      } catch (error) {
        console.error('Failed to fetch all data:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, allData: false }));
      }
    };
    fetchData();
  }, []);

  // Get token stats: circulating supply, total supply, market cap
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/glowStats');
        const data = await res.json();
        setTokenStats(data);
      } catch (error) {
        console.error('Failed to fetch token stats:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, tokenStats: false }));
      }
    };
    fetchData();
  }, []);

  // Wrap allFarmsInfo with a context api
  // Retrieve allFarmsInfo (panels) in FarmDetails
  // Retrieve allFarmsInfo (locations) in FarmList
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/allFarmsInfo');
        const data = await res.json();
        const allFarmsInfo = data.allFarmsInfo;
        setAllFarmsInfo(allFarmsInfo);
      } catch (error) {
        console.error('Failed to fetch all farms info:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, allFarmsInfo: false }));
      }
    };
    fetchData();
  }, []);

  // Get impact power owners
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch('/api/impactPowerOwners');
        const impactPowerOwners = await data.json();
        setImpactPowerOwners(impactPowerOwners.count);
      } catch (error) {
        console.error('Failed to fetch impact power owners:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, impactPowerOwners: false }));
      }
    };
    fetchData();
  }, []);

  // Get impact power price
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/impactPowerPrice');
        const data = await res.json();
        setImpactPowerPrice(data.impactPowerPrice);
      } catch (error) {
        console.error('Failed to fetch impact power price:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, impactPowerPrice: false }));
      }
    };
    fetchData();
  }, []);

  // Get token holder count
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/tokenHolders');
        const data = await res.json();
        setTokenHolderCount(data.tokenHolderCount);
      } catch (error) {
        console.error('Failed to fetch token holders:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, tokenHolders: false }));
      }
    }
    fetchData();
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
      } finally {
        setIsLoading(prev => ({ ...prev, tokenPrice: false }));
      }
    };
  
    fetchData();
  }, []);

  const carbonCredits = useMemo(() => {
    return Array.isArray(weeklyCarbonCredits) 
      ? weeklyCarbonCredits.reduce((acc, curr) => acc + (curr.value || 0), 0)
      : 0;
  }, [weeklyCarbonCredits]);

  const totalPowerProduced = useMemo(() => {
    if (!Array.isArray(weeklyTotalOutput)) return '0';
    const total = weeklyTotalOutput.reduce((acc, curr) => acc + (curr.value || 0), 0);
    return Math.round(total).toLocaleString();
  }, [weeklyTotalOutput]);

  const totalPanelCount: number = useMemo(() => {
    if (!allFarmsInfo) return 0;
    return Object.values(allFarmsInfo).reduce((acc, curr:any) => acc + (curr.panelCount || 0), 0);
  }, [allFarmsInfo]);

  const displayValue = (value:any, loadingState:boolean, formatter = (v:string | number) => v) => {
    if (loadingState) return 'Loading...';
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) return '0';
    return formatter(value);
  };

  const getEquivalentInTrees = () => {
    const CO2_ABSORPTION_PER_TREE_PER_WEEK_IN_KG = 0.19231;
    const KG_OF_CO2_PER_CARBON_CREDIT = 1000;
    if (!Array.isArray(weeklyCarbonCredits) || weeklyCarbonCredits.length < 2) return '0';
    let lastWeekCarbonCredits = weeklyCarbonCredits[weeklyCarbonCredits.length - 2]?.value || 0;
    const equivalentInTrees = (Number(lastWeekCarbonCredits) * KG_OF_CO2_PER_CARBON_CREDIT) / CO2_ABSORPTION_PER_TREE_PER_WEEK_IN_KG;
    return Math.round(equivalentInTrees).toLocaleString();
  };


  return (
    <FarmsInfoContext.Provider value={allFarmsInfo}>
      
    <main className='w-full' style={{maxWidth: "1244px"}}> 
      <div 
        id='green-section' 
        className='lg:h-60 flex lg:flex-row justify-between lg:gap-0 flex-col mb-4 bg-[#A0DF01]' 
        style={{borderRadius: "0.75rem"}}
      >
        <div id='left-subsection' className='flex flex-col lg:w-6/12'>
          <div className='p-3 pb-2 grow max-w-xl flex flex-col justify-between lg:h-auto h-28'>
            <div className='lg:text-2xl text-xl'>
              Carbon Credits Created
            </div>
            <div className='lg:text-5xl text-3xl' style={{color: "#374151"}}>
              {displayValue(carbonCredits, isLoading.allData, (v) => Number(v).toFixed(1))}
            </div>
          </div>
          <div className="h-px w-full bg-beige"></div>
          <div className='p-3 pb-2 grow max-w-xl flex flex-col justify-between lg:h-auto h-28'>
            <div className='lg:text-2xl text-xl'>
              Total Power Produced
            </div>
            <div className='lg:text-5xl text-3xl' style={{color: "#374151"}}>
              {displayValue(totalPowerProduced, isLoading.allData, (v) => `${v.toLocaleString()} kWh`)}
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-beige lg:hidden"></div>
        <div className="w-px h-full bg-beige lg:visible"></div>
        <div id='right-subsection' className='flex lg:flex-row flex-col grow'>
          <div className='flex flex-col lg:w-6/12 w-full'>
            <div className='p-3 grow flex flex-col justify-between h-28'>
              <div className='lg:font-semibold lg:text-lg text-xl'>
                Active Solar Farms
              </div>
              <div className='lg:text-4xl text-3xl' style={{color: "#374151"}}>
                {displayValue(weeklyFarmCount[weeklyFarmCount.length - 1]?.value, isLoading.allData)}
              </div>
            </div>
            <div className="h-px w-full bg-beige"></div>
            <div className='p-3 grow flex flex-col justify-between h-28'>
              <div className='lg:font-semibold lg:text-lg text-xl'>
                CO2 Capture Equivalent in Trees
              </div>
              <div className='lg:text-4xl text-3xl' style={{color: "#374151"}}>
                {displayValue(getEquivalentInTrees(), isLoading.allData, (v) => v.toLocaleString())}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-beige lg:hidden"></div>
          <div className="w-px h-full bg-beige lg:visible"></div>

          <div className='flex flex-col grow'>
            <div className='p-3 grow flex flex-col justify-between h-28'>
              <div className='lg:font-semibold lg:text-lg text-xl'>
                Solar Panel Count
              </div>
              <div className='lg:text-4xl text-3xl text-[#374151]'>
                {displayValue(totalPanelCount.toLocaleString(), isLoading.allFarmsInfo)}
              </div>
            </div>
            <div className="h-px w-full bg-beige"></div>
            <div className='p-3 grow flex flex-col justify-between h-28'>
              <div className='lg:font-semibold lg:text-lg text-xl'>
                Glow Token Price (UNI)
              </div>
              <div className='lg:text-4xl text-3xl' style={{color: "#374151"}}>
                {displayValue(tokenPriceUniswap, isLoading.tokenPrice, (v) => `$${v}`)}
              </div>
            </div>
          </div>

        </div>
      </div>
  
      <div id='figures' className='flex lg:flex-row flex-col gap-2 lg:h-96'>
        <PowerCard weekCount={weekCount} weeklyTotalOutput={weeklyTotalOutput} labels={labels}/>
        <ImpactCard weekCount={weekCount} weeklyCarbonCredits={weeklyCarbonCredits} />
      </div>
    
      <div className='h-8'></div>
      <div id='farms' className='h-10'></div>
      <div  className='text-4xl mb-8'>Explore Farms</div>

      
      <Farms 
        labels={labels.slice(0, labels.length - 1)} 
        weeklyFarmCount={weeklyFarmCount} 
        weeklyDataByFarm={weeklyDataByFarm}
        currentFarmIds={currentFarmIds}
      />
      <div id='divider' className='h-8'></div>

      <div id='financials' className='h-10'></div>
      <div  className='text-4xl mb-8 '>Financials</div>

      <div className='mt-4'>

        <TokenStats 
          impactPowerPrice={impactPowerPrice}
          impactPowerOwners={impactPowerOwners}
          tokenStats={tokenStats}
          tokenHolderCount={tokenHolderCount}
        />

        <div className='mt-8 w-full flex lg:flex-row flex-col gap-2'>
          <TokenCard glwPriceUni={tokenPriceUniswap} glwPriceContract={tokenPriceContract} />
          <FeesCard />
        </div>

      </div>

      <div id='divider' className='h-8'></div>

      <div id='QA' className='h-10'></div>
      
      <div  className='text-4xl'>Q&A</div>
      <FAQ />


    </main>
    <Analytics />
    </FarmsInfoContext.Provider>
  )
}
