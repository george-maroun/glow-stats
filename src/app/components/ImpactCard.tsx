"use client"
import LineBarChart from './LineBarChart';
import { useEffect, useState, useMemo } from 'react';
import TopValues from './TopValues';

import getWeeksSinceStart from '../../../lib/utils/currentWeekHelper';
import getPastMonthValues from '../../../lib/utils/getPastMonthValuesHelper';
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
  weekCount: number;
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

export default function ImpactCard({ weekCount, weeklyCarbonCredits }: ImpactProps) {
  const [protocolFeesPerWeek, setProtocolFeesPerWeek] = useState<ProtocolFeesPerWeek[]>([]);
  const [impactPowerCount, setImpactPowerCount] = useState<number>(0);
  const [impactPowerPrice, setImpactPowerPrice] = useState<number>(0);
  const [impactMultiplier, setImpactMultiplier] = useState<number>(0);

  const weeklyCarbonCreditsValues = weeklyCarbonCredits.map((obj:WeeklyCarbonCredits) => obj.value);
  const currentWeekCarbonCredits = weeklyCarbonCreditsValues 
  ? weeklyCarbonCreditsValues[weeklyCarbonCreditsValues.length - 1]
  : 0;

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

  const pastMonthOutput = useMemo(() => {
    return getPastMonthValues(weeklyCarbonCreditsValues);
  }, [weeklyCarbonCredits]);

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
    <div className='lg:w-6/12'>
      <main className='w-full flex lg:flex-row flex-col justify-start gap-2' style={{maxWidth: "1244px"}}> 
        

        <div id='right-figure' className='rounded-xl lg:h-96 h-auto border w-full' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
          <div className='p-4 pb-2 text-2xl'>
            Carbon Credits Created
          </div>
          <div className='h-px w-full bg-beige' style={{backgroundColor: "rgb(230,230,230"}}></div>
          <TopValues
            title1={`Week ${weekCount} (Current)`} 
            value1={currentWeekCarbonCredits && Number(currentWeekCarbonCredits).toFixed(1)}
            title2="Past Month"
            value2={pastMonthOutput.toFixed(1)}
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
    </div>
  )
}


