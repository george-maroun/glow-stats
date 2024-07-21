'use client'
import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart, { ChartOptions, ChartData } from 'chart.js/auto';
import { CategoryScale, LinearScale, LogarithmicScale } from 'chart.js'; 
import getDateForWeek from '../../../lib/utils/getDateForWeekHelper';
Chart.register(CategoryScale, LinearScale, LogarithmicScale);

interface LineChartProps {
  title: string;
  labels: string[];
  dataPoints: number[];
  dataPoints2?: number[];
  dataLabel?: string;
  dataLabel2?: string;
  color?: string; 
  color2?: string; 
  useLogScale?: boolean;
  interval?: string;
  
}

const LineChart = (props: LineChartProps) => {
  const { 
    title, 
    labels, 
    dataPoints, 
    dataPoints2, 
    dataLabel, 
    dataLabel2, 
    color, 
    color2, 
    useLogScale, 
    interval='Week' 
  } = props;

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: useLogScale ? {
        type: 'logarithmic' as const, // Ensuring 'type' is explicitly 'logarithmic'
      } : {
        type: 'linear' as const, // Ensuring 'type' is explicitly 'linear'
        beginAtZero: true,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10 // Adjust this number to control the maximum amount of labels displayed
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        mode: 'nearest',
        intersect: false,
        callbacks: {
          title: function(tooltipItems: any) {
            let label = tooltipItems[0].label;
            if (interval === 'Date'){
              return `${interval} ${label}`;
            }
            let date = getDateForWeek(parseInt(label));
            return `Week ${label}\n(${date})`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
  };

  const datasets:any = [
    {
      label: dataLabel || "",
      data: dataPoints,
      fill: false,
      borderColor: color || "rgb(34,197,94)",
      borderWidth: 2,
      pointRadius: 0,
    }
  ];
  
  // Conditionally add the second dataset if dataPoints2 is defined
  if (dataPoints2) {
    datasets.push({
      label: dataLabel2 || "",
      data: dataPoints2,
      fill: false,
      borderColor: color2 || "rgb(55,126,184)",
      borderWidth: 2,
      pointRadius: 0,
    });
  }

  const data: ChartData<'line'> = {
    labels: labels,
    datasets: datasets,
  };

  return (
    <>
      <div id='graph' className='p-2 pt-0 pl-4 pb-0 h-44'>
        <div className='text-lg font-semibold mb-0'>{title}</div>
        <div className='' style={{height: "100%", width: '100%'}}>
          <Line data={data} options={options} />
        </div>
      </div>
      <div className='pl-4 pb-2 pt-0 text-slate-400 text-sm text-center' style={{color: "#777777"}}>
        {interval}
      </div>
    </>
  );
};

export default LineChart;
