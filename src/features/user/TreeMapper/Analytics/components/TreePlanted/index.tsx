import data from '../../treesPlantedMockData.json';
import { ApexOptions } from 'apexcharts';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './index.module.scss';
import themeProperties from '../../../../../../theme/themeProperties';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export const TreePlanted = () => {
  const [series, setSeries] = useState([
    {
      name: 'Inflation',
      data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
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
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + '%';
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
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
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
          return val + '%';
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
