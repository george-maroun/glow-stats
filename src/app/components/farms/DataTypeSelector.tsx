import React from 'react';

interface DataTypeSelectorProps {
  selectedDataType: string;
  onChange: (type: string) => void;
}

const DataTypeSelector: React.FC<DataTypeSelectorProps> = ({ selectedDataType, onChange }) => {
  return (
    <select onChange={e => onChange(e.target.value)} value={selectedDataType}>
      <option value="outputs">Weekly Power Output (kWh)</option>
      <option value="carbonCredits">Weekly Carbon Credits</option>
      <option value="tokenRewards">Weekly Token Rewards ($GLW)</option>
      <option value="cashRewards">Weekly USDG Rewards ($)</option>
    </select>
  );
};

export default DataTypeSelector;
