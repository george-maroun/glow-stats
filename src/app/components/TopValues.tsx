import React from 'react';
import ChartCounter from './ChartCounter';

type valueType = number | string | undefined | null;

interface ITopValuesProps {
  title1: string;
  value1: valueType;
  isInfo1?: boolean;
  infoMessage1?: string;
  title2: string;
  value2: valueType;
  isInfo2?: boolean;
  infoMessage2?: string;
  title3: string;
  value3: valueType;
  isInfo3?: boolean;
  infoMessage3?: string;
}

const TopValues = (props:ITopValuesProps) => {
  const { 
    title1,
    value1,
    isInfo1=false,
    infoMessage1="",
    title2, 
    value2, 
    isInfo2=false,
    infoMessage2="",
    title3, 
    value3,
    isInfo3=false,
    infoMessage3="",
  } = props;

  return (
    <div id='top-values' className='flex flex-row'>
      <div className='w-4/12 flex flex-row justify-between'>
        <ChartCounter 
          title={title1} 
          value={value1}
          info={isInfo1}
          infoMessage={infoMessage1}
        />
        <div className='h-full w-px' style={{backgroundColor: "rgb(230,230,230"}}></div>
      </div>
      <div className='w-4/12 flex flex-row justify-between'>
        <ChartCounter 
          title={title2} 
          value={value2}
          info={isInfo2}
          infoMessage={infoMessage2}
        />
        <div className='h-full w-px' style={{backgroundColor: "rgb(230,230,230"}}></div>
      </div>
      <div className='w-4/12 flex flex-row justify-between'>
        <ChartCounter 
          title={title3} 
          value={value3} 
          info={isInfo3}
          infoMessage={infoMessage3}
          />
      </div>
    </div>
  )
};

export default TopValues;