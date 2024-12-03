import React, { useMemo, useState } from 'react';
import LineChart from './LineChart';
import getPastMonthValues from '../../../lib/utils/getPastMonthValuesHelper';
import TopValues from './TopValues';

interface PowerCardProps {
  weekCount: number;
  labels: string[];
  weeklyTotalOutput: { week: number; value: number }[];
}

const PowerCard = (props:PowerCardProps) => {
  const { weekCount, labels, weeklyTotalOutput } = props;
  const [useLogScale, setUseLogScale] = useState(false);

  const weeklyOutputs = weeklyTotalOutput.map((data: { week: number; value: number }) => Number(data.value.toFixed(2)));

  const currentWeekOutput = weeklyOutputs.length && weeklyOutputs[weeklyOutputs.length - 1];

  const weeklyOutputWithoutCurrentWeek = weeklyOutputs.slice(0, weeklyOutputs.length - 1);

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
      
      <TopValues
        title1={`Week ${weekCount} (Current)`} 
        value1={currentWeekOutput && Number(currentWeekOutput.toFixed(0)).toLocaleString() + " kWh"}
        title2="Past Month"
        value2={pastMonthOutput && Number(pastMonthOutput.toFixed(0)).toLocaleString() + " kWh"}
        title3="Homes Powered"
        value3={pastMonthOutput && Math.round(pastMonthOutput / 900)}
        isInfo3={true}
        infoMessage3="The number of homes powered by Glow Farms based on the power generated last month."
      />
      
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
        dataPoints={weeklyOutputWithoutCurrentWeek} 
        dataLabel={"Output"}
        useLogScale={useLogScale}
      />
      
    </div>
  )
};

export default PowerCard;