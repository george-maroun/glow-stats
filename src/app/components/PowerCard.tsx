import React, { useEffect, useMemo, useState } from 'react';
import ChartCounter from './ChartCounter';
import LineChart from './LineChart';
import getPastMonthValues from '../../../lib/utils/getPastMonthValuesHelper';

type WeeklyOutput = {
  week: number;
  value: number;
}

interface PowerCardProps {
  weekCount: number;
  labels: string[];
}

const PowerCard = (props:PowerCardProps) => {
  const { weekCount, labels } = props;
  const [useLogScale, setUseLogScale] = useState(false);
  const [weeklyOutputs, setWeeklyOutputs] = useState<number[]>([]);

  // Get weekly outputs
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/api/weeklyOutput');
      const weeklyOutputs = await data.json();
      const weeklyOutputsDataPoints = await weeklyOutputs.map((data: WeeklyOutput) => Math.round(data.value / 1000000));
      setWeeklyOutputs(weeklyOutputsDataPoints);
    };
    fetchData();
  }, [weekCount]);

  const currentWeekOutput = weeklyOutputs.length && weeklyOutputs[weeklyOutputs.length - 1];

  const pastMonthOutput = useMemo(() => {
    return getPastMonthValues(weeklyOutputs);
  }, [weeklyOutputs]);

  const toggleScale = () => {
    setUseLogScale(!useLogScale);
  }

  return (
    <div id='left-figure' className='rounded-xl h-full lg:w-6/12 border ' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
      <div className='p-4 pb-2 text-2xl'>
        Power Output of Glow Farms
      </div>
      <div className='h-px w-full bg-beige' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div id='top-values' className='flex flex-row'>
        <div className='w-4/12 flex flex-row justify-between'>
          <ChartCounter 
            title={`Week ${weekCount} Output (so far)`} 
            value={currentWeekOutput && Number(currentWeekOutput).toFixed(0) + " kWh"} 
          />
          <div className='h-full w-px bg-beige' style={{backgroundColor: "rgb(230,230,230"}}></div>
        </div>
        <div className='w-4/12 flex flex-row justify-between'>
          <ChartCounter title="Past Month Output" value={pastMonthOutput && Number(pastMonthOutput.toFixed(0)) + " kWh"} />
          <div className='h-full w-px bg-beige' style={{backgroundColor: "rgb(230,230,230"}}></div>
        </div>
        <div className='w-4/12 flex flex-row justify-between'>
          <ChartCounter 
            title={"Equivalent in Homes"} 
            value={pastMonthOutput && Math.round(pastMonthOutput / 900)} 
            info={true} 
            infoMessage="The number of homes that Glow farms could serve based on the power generated last month."
            />
        </div>
      </div>
      <div className='h-px w-full bg-beige' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div className='flex flex-row justify-between items-center pl-4 pb-2 pt-2 pr-4'>
        <div className='text-slate-400 text-md' style={{color: "#777777"}}>
          Weekly Power Output (in kWh)
        </div>
        <div className='flex flex-row gap-2 text-sm'>
          <div className='text-[#777777]'>
            Scale:
          </div>
          <button onClick={toggleScale} className={`${useLogScale ? "text-[#777777]" : ""}`}>
            Linear
          </button>
          <button onClick={toggleScale} className={`${useLogScale ? "" : "text-[#777777]"}`}>
            Log
          </button>
        </div>
      </div>
      <LineChart 
        title="" 
        labels={labels.slice(0, labels.length - 1)} 
        dataPoints={weeklyOutputs} 
        dataLabel={"Output"}
        useLogScale={useLogScale}
      />
      
    </div>
  )
};

export default PowerCard;