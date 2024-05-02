import React from 'react';
import ChartCounter from './ChartCounter';

type valueType = number | string | undefined | null;

interface ITopValuesProps {
  title1: string;
  value1: valueType;
  title2: string;
  value2: valueType;
  title3: string;
  value3: valueType;
}

const TopValues = (props:ITopValuesProps) => {
  const { title1, value1, title2, value2, title3, value3 } = props;

  return (
    <div id='top-values' className='flex flex-row'>
      <div className='w-4/12 flex flex-row justify-between'>
        <ChartCounter 
          title={title1} 
          value={value1}
        />
        <div className='h-full w-px' style={{backgroundColor: "rgb(230,230,230"}}></div>
      </div>
      <div className='w-4/12 flex flex-row justify-between'>
        <ChartCounter 
          title={title2} 
          value={value2}
        />
        <div className='h-full w-px' style={{backgroundColor: "rgb(230,230,230"}}></div>
      </div>
      <div className='w-4/12 flex flex-row justify-between'>
        <ChartCounter 
          title={title3} 
          value={value3} 
          />
      </div>
    </div>
  )
};

export default TopValues;