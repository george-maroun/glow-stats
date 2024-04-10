import React, { useState } from 'react';

type TooltipProps = {
  message: string;
  children: React.ReactNode;
};

const Tooltip = ({ message, children }:TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {isVisible && (
        <div 
          className="absolute top-full lg:left-0 right-0 text-base text-center w-48 lg:translate-y-2 lg:translate-x-2 translate-y-2 -translate-x-2 mb-2.5 p-2.5 rounded z-50 break-words opacity-90"
          style={{ color: 'white', backgroundColor: 'black', borderRadius: "0.75rem"}}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
