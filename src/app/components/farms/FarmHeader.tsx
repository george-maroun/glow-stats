import React from 'react';
import StatusIndicator from '../StatusIndicator';

interface FarmHeaderProps {
  selectedFarm: number;
  handleResetFarmSelection: () => void;
}

const FarmHeader: React.FC<FarmHeaderProps> = ({ selectedFarm, handleResetFarmSelection }) => {
  return (
    <div className='p-4 pb-2 text-2xl flex flex-row justify-between items-center'>
      <div>
        {selectedFarm ? (
          <div className='flex flex-row gap-4 items-center'>
            <div>{`Farm ${selectedFarm}`}</div>
            <StatusIndicator status={true} />
          </div>
        ) : 'Statistics'}
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
