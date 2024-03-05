const StatusIndicator = ({ status }: { status: boolean }) => {
    return (
      <div className="flex flex-row gap-1 items-center">
        <div 
          className={`w-2 h-2 rounded-full`}
          style={{backgroundColor: status ? "rgb(34,197,94)" : "orange"}}
        ></div>
        <div className="text-sm">{status ? "Active" : "Onboarding"}</div>
      </div>
    );
}

export default StatusIndicator;