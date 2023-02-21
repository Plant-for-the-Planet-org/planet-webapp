import data from '../../treesPlantedMockData.json';
import { format } from 'date-fns';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './index.module.scss';
import themeProperties from '../../../../../../theme/themeProperties';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const plantedTrees = [];
const timeFrame = [];

data.forEach((plant) => {
  plantedTrees.push(plant.trees_planted);
  timeFrame.push(format(new Date(plant.plant_date), 'MM/dd/yy'));
});

export const TreePlanted = () => {
  const [series, setSeries] = useState([
    {
      data: plantedTrees || [],
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          download: true,
        },
        offsetY: -15,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },

    fill: {
      colors: themeProperties.primaryColor,
    },

    xaxis: {
      categories: timeFrame,
      position: 'top',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
      tickPlacement: 'on',
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val;
        },
      },
    },
  });

  return (
    <>
      <p className={styles.title}>Trees Planted</p>
      <ReactApexChart options={options} series={series} type="bar" />
    </>
  );
};
