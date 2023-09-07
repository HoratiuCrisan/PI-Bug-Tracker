"use client"
import React, {useState, useEffect} from 'react';
import ReactApexChart from 'react-apexcharts';

interface Pie {
    labels: Array<string>,
    series: Array<number>
}

interface Props {
    props: Pie
}

const PieChart = ({ props }: Props) => {
  const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient)
        return null

const ReactApexChart = require('react-apexcharts').default

  const options = {
    chart: {
        type: 'pie'
    },
    labels: props.labels,
    colors: ['#9B59B6', '#F1C40F', '#1ABC9C', '#34495E'],
    responsive: [
      {
        breakpoint: 768, // Adjust this value as needed
        options: {
          chart: {
            width: '100%', // Set the chart width for this breakpoint
          },
        },
      },
      // Add more responsive breakpoints as needed
    ],
    
  }

  const series = props.series

  return (
    <ReactApexChart options={options} series={series} type="pie" height={200} />
  );
};

export default PieChart;