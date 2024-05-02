

const FarmDetatils = () => {
  return (
    <div id='right-figure' className='rounded-xl lg:h-full h-auto lg:w-6/12 border' style={{backgroundColor: "white", borderColor: "rgb(220,220,220"}}>
          {/* <div className='p-4 pb-2 text-2xl flex flex-row justify-between items-center'>
            <div>{selectedFarm ? 
              (<div className='flex flex-row gap-4 items-center'>
                <div>
                  {`Farm ${selectedFarm}`}
                </div>
                <StatusIndicator status={true} />
              </div>) 
              :  
              "Farms"}
            </div>
            {selectedFarm > 0 && (
              <div onClick={handleResetFarmSelection} className='pl-4 pb-0 p-1 text-gray text-base cursor-pointer underline decoration-1 underline-offset-1'>
                Back to all farms
              </div>
            )}
          </div>
          <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>

        {selectedFarm > 0 ? 
          (<TopValues 
            title1='Location' 
            value1={selectedFarmLocation}
            title2='Weather'
            value2={weatherString}
            title3={`Week ${weekCount} Output (so far)`}
            value3={`${selectedFarmOutputs.length ? selectedFarmOutputs[selectedFarmOutputs.length - 1].toFixed(0) : ''} kWh`}
            />) :
          (<TopValues 
            title1='Active' 
            value1={ActiveFarmsCount}
            title2='Onboarding'
            value2={onboardingFarms}
            title3={"Past Month Increase"}
            value3={weeklyFarmCounts.length ? pastMonthFarms.toString() : 0}
            />
          )}

          <div className='h-px w-full' style={{backgroundColor: "rgb(230,230,230"}}></div>
          <div className='pl-4 pb-2 pt-2 text-gray text-md'>
          {selectedFarm ? (
            <>
              <DataTypeSelector onChange={(type:any) => setSelectedDataType(type)} />
              <LineChart 
              title="" 
              labels={dataLabels} 
              dataPoints={selectedDataType === 'powerOutput' ? selectedFarmOutputs : selectedFarmCarbonCredits}
            /></>
            ) : (
              <>
              <div>Weekly Farm Count</div>
            <LineChart 
              title="" 
              labels={dataLabels} 
              dataPoints={dataPoints}
            /></>)}
          </div>
        </div> */}
      </div>
  )
}

export default FarmDetatils;