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
      events: {
        beforeZoom: function (ctx) {
          ctx.w.config.xaxis.range = undefined;
        },
        // zoomed: function (chartContext, { xaxis }) {
        //   // calculate the new columnWidth based on the zoomed range

        //   const { max, min } = xaxis;
        //   let columnWidth: number | string = Math.abs(
        //     Math.ceil((max - min) / 10)
        //   );

        //   if (columnWidth <= 3) columnWidth = '200%';
        //   else columnWidth = '30%';
        //   chartContext.w.config.plotOptions.bar.columnWidth = columnWidth;
        // },
      },
      type: 'bar',
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
          position: 'top',
        },
        // columnWidth: '70%',
      },
    },
    dataLabels: {
      enabled: false,
    },

    fill: {
      colors: themeProperties.primaryColor,
    },

    tooltip: {
      y: {
        title: {
          formatter: () => 'Planted Trees',
        },
      },
    },

    xaxis: {
      range: 20,
      max: 20,
      labels: {
        rotate: -90,
      },
      categories: timeFrame,
      position: 'bottom',
      axisBorder: {
        show: true,
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
      tickPlacement: 'on',
    },
    yaxis: {
      // logarithmic: true, //open bug that causes data labels to render wrong numbers
      axisBorder: {
        show: true,
      },
      labels: {
        show: true,
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
