
const CounterRow = ({
  title1,
  value1,
  title2,
  value2
}: any) => {
  return (
    <div className="flex flex-row h-4/12"> 
      <div className="p-2 pb-1 pl-4 w-6/12">
        <div className="text-gray mb-1">
          {title1}
        </div>
        <div className="text-xl mb-1">
          {value1}
        </div>
      </div>
      <div className='w-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div className="p-2 pb-1 pr-4 w-6/12">
        <div className="text-gray mb-1">
          {title2}
        </div>
        <div className="text-xl mb-1">
          {value2}
        </div>
      </div>
    </div>
  )
}

const TokenStats = ({
  tokenStats, 
  tokenHolderCount,
  impactPowerPrice, 
  impactPowerOwners
}:any) => {


  const totalSupply = Math.round(tokenStats.totalSupply || 0);
  const circSupply = Math.round(tokenStats.circulatingSupply || 0);
  const marketCap = Math.round(tokenStats.marketCap || 0);

  return (
    <div className='rounded-xl h-full lg:w-4/12 border' style={{backgroundColor: "white", borderColor: "rgb(220,220,220)"}}>
      <div className="p-4 pb-1 text-2xl">
        Token Statistics
      </div>
      <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
      <div className="flex flex-col justify-between ">
        <CounterRow 
          title1={"GLW Holders"}
          value1={tokenHolderCount}
          title2={"Market Cap"}
          value2={marketCap ? marketCap.toLocaleString() : ''}
        />
        <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
        <CounterRow 
          title1={"Circulating Supply"}
          value1={circSupply ? circSupply.toLocaleString() : ''}
          title2={"Total Supply"}
          value2={totalSupply ? totalSupply.toLocaleString() : ''}
        />
        <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
        <CounterRow 
          title1={"Impact Power Price"}
          value1={"$" + impactPowerPrice}
          title2={"Impact Power Owners"}
          value2={impactPowerOwners}
        />
      </div>
    </div>
  )
};

export default TokenStats;