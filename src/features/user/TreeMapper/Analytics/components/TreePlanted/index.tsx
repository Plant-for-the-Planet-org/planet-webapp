import data from '../../treesPlantedMockData.json';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './index.module.scss';
import themeProperties from '../../../../../../theme/themeProperties';
import { getFormattedNumber } from '../../../../../../utils/getFormattedNumber';
import {
  getTimeFrames,
  useAnalytics,
} from '../../../../../common/Layout/AnalyticsContext';
import DownloadSolid from '../../../../../../../public/assets/images/icons/share/DownloadSolid';
import ReactDOMServer from 'react-dom/server';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const plantedTrees = [];
const dummy_timeFrame = [];

data.forEach((plant) => {
  plantedTrees.push(plant.trees_planted);
  dummy_timeFrame.push(format(new Date(plant.plant_date), 'MM/dd/yy'));
});

export const TreePlanted = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation(['treemapperAnalytics']);

  const [series, setSeries] = useState([
    {
      data: plantedTrees || [],
    },
  ]);

  const { project, fromDate, toDate, timeFrame } = useAnalytics();

  const getDownloadIcon = () => {
    return <DownloadSolid color="#6E8091" />;
  };

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
          download: `${ReactDOMServer.renderToString(getDownloadIcon())}`,
        },
        offsetY: -15,
        export: {
          csv: {
            filename: `${t('treesPlanted')}`,
          },
          svg: {
            filename: `${t('treesPlanted')}`,
          },
          png: {
            filename: `${t('treesPlanted')}`,
          },
        },
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
      categories: dummy_timeFrame,
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

  useEffect(() => {
    if (project) {
      const FILE_NAME = `${project.name}__${t('treesPlanted')}__${format(
        fromDate,
        'dd-MMM-yy'
      )}__${format(toDate, 'dd-MMM-yy')}`;

      setOptions({
        ...options,
        chart: {
          ...options.chart,
          toolbar: {
            ...options.chart.toolbar,
            export: {
              ...options.chart.toolbar.export,
              csv: {
                ...options.chart.toolbar.export.csv,
                filename: FILE_NAME,
              },
              svg: {
                filename: FILE_NAME,
              },
              png: {
                filename: FILE_NAME,
              },
            },
          },
        },
      });
    }
  }, [project, toDate, fromDate]);

  const fetchPlantedTrees = async () => {
    const res = await fetch(
      `/api/analytics/trees-planted?timeFrame=${timeFrame}`,
      {
        method: 'POST',
        body: JSON.stringify({
          projectId: project ? project.id : null,
          startDate: fromDate,
          endDate: toDate,
        }),
      }
    );
    const plantedTrees = await res.json();
    console.log('==>', plantedTrees);
  };

  useEffect(() => {
    const isValidTimeFrame = getTimeFrames(toDate, fromDate).includes(
      timeFrame!
    );
    if (isValidTimeFrame) {
      fetchPlantedTrees();
    }
  }, [project, fromDate, toDate, timeFrame]);

  return (
    <>
      <p className={styles.title}>{t('treesPlanted')}</p>
      <ReactApexChart options={options} series={series} type="bar" />
    </>
  );
};
