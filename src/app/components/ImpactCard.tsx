"use client"
import LineBarChart from './LineBarChart';
import ChartCounter from './ChartCounter';
import { useEffect, useState } from 'react';
import TopValues from './TopValues';

import getWeeksSinceStart from '../../../lib/utils/currentWeekHelper';
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

interface ImpactProps {
  carbonCredits: number;
  weeklyCarbonCredits: {week: number, value: number}[];
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

export default function ImpactCard({ carbonCredits, weeklyCarbonCredits }: ImpactProps) {
  const [protocolFeesPerWeek, setProtocolFeesPerWeek] = useState<ProtocolFeesPerWeek[]>([]);
  const [impactPowerCount, setImpactPowerCount] = useState<number>(0);
  const [impactPowerPrice, setImpactPowerPrice] = useState<number>(0);
  const [impactMultiplier, setImpactMultiplier] = useState<number>(0);

    const weeklyCarbonCreditsValues = weeklyCarbonCredits.map((obj:WeeklyCarbonCredits) => obj.value);

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
          <TopValues
            title1="Carbon Credits Created"
            value1={carbonCredits}
            title2="Total USDC Committed"
            value2={"26,623"}
            title3="Impact Multiplier"
            value3={impactMultiplier.toFixed(0)}
            isInfo3={true}
            infoMessage3={`The Impact Multiplier measures the efficiency of impact power investment. Currently, for every dollar spent on Impact Power, $${impactMultiplier.toFixed(0)} of solar energy is deployed.`}
          />
    
          <div className='h-px w-full bg-beige' style={{backgroundColor: "rgb(230,230,230"}}></div>
          <div className='pl-4 pb-2 pt-2 text-slate-400 text-md' style={{color: "#777777"}}>
              Weekly Carbon Credits
            </div>
            <LineBarChart 
              title="" 
              labels={labels} 
              dataPoints={weeklyCarbonCreditsValues} 
            />

        </div>
      </main>
    </>
  )
}


