"use client"
import LineBarChart from './LineBarChart';
import ChartCounter from './ChartCounter';
import { useEffect, useState } from 'react';

import getWeeksSinceStart from '../../../lib/utils/currentWeekHelper';
import 'react-tooltip/dist/react-tooltip.css'
export const fetchCache = 'force-no-store';
export const dynamic = "force-dynamic";

interface ProtocolFeesPerWeek {
  id: string;
  totalPayments: string;
}

interface WeeklyCarbonCredits {
  week: number;
  value: number;
}

const createLabels = () => {
  const weeks = getWeeksSinceStart();
  const labels = [];
  for (let i = 0; i <= weeks; i++) {
    labels.push(`${i}`);
  }
  labels.pop();
  return labels;
}

export default function Impact() {
  const [weeklyCarbonCredits, setWeeklyCarbonCredits] = useState<number[]>([]);
  const [totalCarbonCredits, setTotalCarbonCredits] = useState<number>(0);
  const [protocolFeesPerWeek, setProtocolFeesPerWeek] = useState<ProtocolFeesPerWeek[]>([]);
  const [impactPowerCount, setImpactPowerCount] = useState<number>(0);
  const [impactPowerPrice, setImpactPowerPrice] = useState<number>(0);
  const [impactMultiplier, setImpactMultiplier] = useState<number>(0);

    // Get impact power price
    useEffect(() => {
      const fetchData = async () => {
        const res = await fetch('/api/impactPowerPrice');
        const data = await res.json();
        setImpactPowerPrice(data.impactPowerPrice);
      };
      fetchData();
    }, []);

    useEffect(() => {
      async function fetchImpactPowerCount() {
        const response = await fetch('/api/impactPowerCount');
        const data = await response.json();
        setImpactPowerCount(data.impactPowerCount);
      }
      fetchImpactPowerCount();
    }, []);

    // Get protocol fees per week
    useEffect(() => {
      const fetchData = async () => {
        const data = await fetch('/api/protocolFeesPerWeek');
        const protocolFees = await data.json();
        setProtocolFeesPerWeek(protocolFees.protocolFeesPerWeek);
      };
      fetchData();
    }, []);

  useEffect(() => {
    async function fetchCarbonCredits() {
      const response = await fetch('/api/carbonCredits');
      const data = await response.json();
      const carbonCreditsData = data.weeklyCarbonCredits.map((obj:WeeklyCarbonCredits) => obj.value);
      setWeeklyCarbonCredits(carbonCreditsData);
      setTotalCarbonCredits(data.GCCSupply);
    }
    fetchCarbonCredits();
  }, []);

  const labels = createLabels();

  const getImpactMultiplier = () => {
    const lifetimeProtocolFees = protocolFeesPerWeek.reduce((acc, curr:ProtocolFeesPerWeek) => acc + Number(curr.totalPayments), 0) / 1000000;
    const costOfImpactPower = impactPowerPrice;
    const totalImpactPower = impactPowerCount / 10 ** 12;
    return lifetimeProtocolFees / (costOfImpactPower * totalImpactPower);
  }

  useEffect(() => {
    if (protocolFeesPerWeek.length === 0 || impactPowerCount === 0 || impactPowerPrice === 0) {
      return;
    }
    setImpactMultiplier(getImpactMultiplier());
  }, [protocolFeesPerWeek, impactPowerCount, impactPowerPrice]);
  
  return (
    <>
      <main className='w-full flex lg:flex-row flex-col justify-start gap-2' style={{maxWidth: "1244px"}}> 
        

        <div id='right-figure' className='rounded-xl lg:h-96 h-auto border w-full' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
          <div className='p-4 pb-2 text-2xl'>
            Impact
          </div>
          <div className='h-px w-full bg-beige' style={{backgroundColor: "rgb(230,230,230"}}></div>
          <div id='top-values' className='flex flex-row'>
              <div className='w-4/12 flex flex-row justify-between'>
                <ChartCounter title="Carbon Credits Created" value={totalCarbonCredits} />
                <div className='h-full w-px bg-beige' style={{backgroundColor: "rgb(230,230,230"}}></div>
              </div>
              <div className='w-4/12 flex flex-row justify-between'>
                <ChartCounter title="Total USDC Committed" value={"25,606"} />
                <div className='h-full w-px bg-beige' style={{backgroundColor: "rgb(230,230,230"}}></div>
              </div>
              <div className='w-4/12 flex flex-row justify-between'>
                <ChartCounter 
                  title={"Impact Multiplier"} 
                  value={`x ${impactMultiplier.toFixed(0)}`} 
                  info={true}
                  infoMessage={`The Impact Multiplier measures the efficiency of impact power investment. Currently, for every dollar spent, $${impactMultiplier.toFixed(0)} of solar energy is deployed.`}
                />
              </div>
            </div>
          <div className='h-px w-full bg-beige' style={{backgroundColor: "rgb(230,230,230"}}></div>
          <div className='pl-4 pb-2 pt-2 text-slate-400 text-md' style={{color: "#777777"}}>
              Weekly Carbon Credits
            </div>
            <LineBarChart 
              title="" 
              labels={labels} 
              dataPoints={weeklyCarbonCredits} 
            />

        </div>
      </main>
    </>
  )
}


