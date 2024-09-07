import { AiOutlineInfoCircle } from 'react-icons/ai';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface ChartCounterProps {
  title: string;
  value: number | string | null | undefined;
  info?: boolean;
  infoMessage?: string;
}

const ChartCounter = ({ title, value, info=false, infoMessage="" }: ChartCounterProps) => {

  // This is somewhat hacky, but it works for now
  const valueSize = value ? value.toString().length : 0;

  return (
    <div className='flex flex-col justify-between'>
      {info ? 
      (
        <div className='pl-4 pb-0 p-1 mb-1 text-gray text-md flex flex-row justify-between items-center gap-1'>
          {title}
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger>{<AiOutlineInfoCircle/>}</TooltipTrigger>
              <TooltipContent className='w-52 text-center text-black'>
                <p>{infoMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
      :
      (<div className='pl-4 pb-0 p-1 text-gray text-md'>
        {title}
      </div>)
      }
      <div className={`pl-4 p-1 pb-2 lg:text-xl ${valueSize >= 9 ? "text-base" : "text-xl"}`}>
        {(value) ? value : "Loading..."}
      </div>
    </div>
  )
}

export default ChartCounter;