import { AiOutlineInfoCircle } from 'react-icons/ai';
import Tooltip from './Tooltip';

interface ChartCounterProps {
  title: string;
  value: number | string | null | undefined;
  info?: boolean;
  infoMessage?: string;
}

const ChartCounter = ({ title, value, info=false, infoMessage="" }: ChartCounterProps) => {

  return (
    <div className='flex flex-col justify-between'>
      {info ? 
      (
        <div className='pl-4 pb-0 p-1 text-gray text-md flex flex-row justify-between items-center gap-1'>
          {title}
          <Tooltip message={infoMessage}><AiOutlineInfoCircle/></Tooltip>
        </div>
      )
      :
      (<div className='pl-4 pb-0 p-1 text-gray text-md'>
        {title}
      </div>)
      }
      <div className='pl-4 p-1 pb-2 text-xl'>
        {(value) ? value : "Loading..."}
      </div>
    </div>
  )
}

export default ChartCounter;