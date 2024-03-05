'use client'
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'; 
import { Chart } from 'react-chartjs-2';

// Register the components needed for our chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title: string;
  labels: string[];
  dataPoints: number[];
  styles?: string;
}

const LineBarChart = (props: LineChartProps) => {
  const { title, labels, dataPoints, styles } = props;

  // Calculate cumulative data for the line chart
  const cumulativeData = dataPoints.reduce<number[]>((acc, curr, i) => [...acc, (acc[i - 1] || 0) + curr], []);


  const options = {
    responsive: true,
    maintainAspectRatio: false, // Set to false to fill the container
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        mode: 'nearest',
        intersect: false,
        callbacks: {
          title: function(tooltipItems:any) {
            let label = tooltipItems[0].label;
            return `Week ${label}`; // Customizing the title to prepend "Week"
          },
          // If you want to customize the label displayed in the tooltip as well, uncomment and modify below
          // label: function(tooltipItem) {
          //   return `Your custom label text here: ${tooltipItem.formattedValue}`;
          // },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      
    },
    
  } as any;

  const data = {
    labels: labels,
    datasets: [
      {
        type: 'line',
        label: 'Cumulative',
        data: cumulativeData,
        fill: false,
        borderColor: 'rgb(34,197,94)',
        borderWidth: 2,
        pointRadius: 0,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Value',
        data: dataPoints,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        yAxisID: 'y',
      }
    ],
  } as any;

  return (
    <>
      <div id='graph' className='p-2 pt-0 pl-4 pb-0 h-44'>
        <div className='text-lg font-semibold mb-0'>{title}</div>
        <div className='' style={{height: "100%", width: '100%'}}>
          <Chart type='bar' data={data} options={options} />
        </div>
      </div>
      <div className='pl-4 pb-2 pt-0 text-slate-400 text-sm text-center' style={{color: "#777777"}}>
        Week
      </div>
    </>
  );
};

export default LineBarChart;
