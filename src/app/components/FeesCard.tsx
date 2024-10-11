import React, {useState, useEffect} from "react";
import getWeeksSinceStart from "@/../lib/utils/currentWeekHelper";

interface ProtocolFeePayment {
  id: string;
  totalPayments: string;
}

const FeesCard = () => {
  const [protocolFeesPerWeek, setProtocolFeesPerWeek] = useState<ProtocolFeePayment[]>([]);

  const weeksSinceStart = getWeeksSinceStart();

  // Get protocol fees per week
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/api/protocolFeesPerWeek');
      const protocolFees = await data.json();
      setProtocolFeesPerWeek(protocolFees.protocolFeesPerWeek);
    };
    fetchData();
  }, []);

  function listProtocolFees() {
    const cumulativeFeesList: string[] = [];
    let cumulativeFees = 0;
    
    // Determine whether to remove the first entry
    const feesToDisplay = weeksSinceStart > Number(protocolFeesPerWeek[0].id)
      ? protocolFeesPerWeek
      : protocolFeesPerWeek.slice(1);

    // Calculate cumulative fees
    for (let i = feesToDisplay.length - 1; i >= 0; i--) {
      const fee = Number(feesToDisplay[i].totalPayments) / 1000000;
      cumulativeFees += fee;
      const formattedCumulativeFees = (Math.round(cumulativeFees * 100) / 100).toLocaleString();
      cumulativeFeesList.unshift(formattedCumulativeFees);
    }
  
    return (
      <div>
        {feesToDisplay.map((protocolFee, index) => {
          const fee = Number(protocolFee.totalPayments) / 1000000;
          const roundedFee = Math.round(fee * 100) / 100;
          const formattedFee = roundedFee.toLocaleString();
          const formattedCumulativeFees = cumulativeFeesList[index];
  
          return (
            <div key={index}>
              <div className='flex flex-row justify-start mt-1 mb-2'>
                <div className='pl-4 pb-0 p-1 text-gray text-md w-3/12'>
                  {protocolFee.id}
                </div>
                <div className='pl-4 pb-0 p-1 text-gray text-md w-5/12'>
                  {formattedFee}
                </div>
                <div className='pl-4 pb-0 p-1 text-gray text-md w-4/12'>
                  {formattedCumulativeFees}
                </div>
              </div>
              <div className='h-px w-full' style={{backgroundColor: "rgb(240,240,240"}}></div>
            </div>
          );
        })}
      </div>
    );
  }


  return (
    <div id='fees-table' className='rounded-xl lg:w-6/12  border lg:grow ' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
      <div className='p-4 pb-2 text-2xl'>
        Protocol Fees
      </div>
      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div className='flex flex-row justify-start mt-1 mb-2'>
        <div className='pl-4 pb-0 p-1 text-gray text-md w-3/12'>
          Week
        </div>
        <div className='pl-4 pb-0 p-1 text-gray text-md w-5/12'>
          Amount paid (USDG)
        </div>
        <div className='pl-4 pb-0 p-1 text-gray text-md w-4/12'>
          Cumulative
        </div>
      </div>
      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div className='lg:h-64 overflow-y-auto mb-2' style={{height: '272px'}}>
        {protocolFeesPerWeek.length > 0 ? listProtocolFees() : <div className='p-4 '>Loading...</div>}
      </div>
    </div>
  );
}

export default FeesCard;
