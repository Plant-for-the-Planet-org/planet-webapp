import data from '../../treesPlantedMockData.json';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './index.module.scss';
import themeProperties from '../../../../../../theme/themeProperties';
import { getFormattedNumber } from '../../../../../../utils/getFormattedNumber';

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
  const {
    i18n: { language },
  } = useTranslation();

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
        borderRadius: 2,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return getFormattedNumber(language, val);
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
      labels: {
        rotate: -90,
      },
      categories: timeFrame,
      position: 'bottom',
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
          return getFormattedNumber(language, val);
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
