import React from 'react';
import getWeatherEmoji from '../../../../lib/utils/getWeatherEmojiHelper';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface FarmHeaderProps {
  selectedFarm: number;
  handleResetFarmSelection: () => void;
  selectedFarmWeather?: any;
}

const FarmHeader: React.FC<FarmHeaderProps> = ({ selectedFarm, handleResetFarmSelection, selectedFarmWeather }) => {
  const weatherEmoji = selectedFarm && selectedFarmWeather && selectedFarmWeather.hasOwnProperty('weather') ? getWeatherEmoji(selectedFarmWeather) : null;
  const weatherDescription = selectedFarmWeather?.weather[0]?.description;

  return (
    <div className='p-4 pb-2 text-2xl flex flex-row justify-between items-center'>
      <div>
        {selectedFarm ? (
          <div className='flex flex-row gap-4 items-center'>
            <div>{`Farm ${selectedFarm}`}</div>
            
            {weatherEmoji && (
              
              <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger>{weatherEmoji}</TooltipTrigger>
                <TooltipContent>
                  <p>{weatherDescription}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            )}
          </div>
        ) : 'Farm Statistics'}
      </div>
      {selectedFarm > 0 ? (
        <div onClick={handleResetFarmSelection} className='pl-4 pb-0 p-1 text-gray text-base cursor-pointer underline decoration-1 underline-offset-1'>
          Back to all farms
        </div>
      ) : (
        <div className='pl-4 pb-0 mb-1 p-1 text-gray opacity-60 text-right italic text-base text-italic underline-offset-1'>
          Click on a farm to view stats
        </div>
      )}
    </div>
  );
};

export default FarmHeader;