import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import themeProperties from '../../../../../../theme/themeProperties';
import { getFormattedNumber } from '../../../../../../utils/getFormattedNumber';
import data from '../../speciesPlantedMockData.json';
import styles from './index.module.scss';
import { Tooltip } from './Tooltip';
import DownloadSolid from '../../../../../../../public/assets/images/icons/share/DownloadSolid';
import ReactDOMServer from 'react-dom/server';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import { format } from 'date-fns';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const treeCountBySpecies = {};

for (const item of data) {
  const { scientific_species_id, name, tree_count } = item;

  if (!treeCountBySpecies[scientific_species_id]) {
    treeCountBySpecies[scientific_species_id] = { name, tree_count: 0 };
  }

  treeCountBySpecies[scientific_species_id].tree_count += parseInt(tree_count);
}

const result = Object.entries(treeCountBySpecies)
  .map(([scientific_species_id, { name, tree_count }]) => ({
    scientific_species_id,
    name,
    tree_count,
  }))
  .sort((a, b) => b.tree_count - a.tree_count);

const species = [];
const species_num = [];

Object.entries(result).map((s) => {
  species.push(s[1].name);
  species_num.push(s[1].tree_count);
});

const getDownloadIcon = () => {
  return <DownloadSolid color="#6E8091" />;
};

export const SpeciesPlanted = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation(['treemapperAnalytics']);

  const { project, fromDate, toDate } = useAnalytics();

  const [series, setSeries] = useState([
    {
      data: species_num || [],
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      events: {
        beforeZoom: function (ctx) {
          ctx.w.config.xaxis.range = undefined;
        },
        zoomed: function (chartContext, { xaxis }) {
          // calculate the new columnWidth based on the zoomed range

          const { max, min } = xaxis;
          let columnWidth: number | string = Math.abs(
            Math.ceil((max - min) / 10)
          );

          if (columnWidth <= 3) columnWidth = '200%';
          else columnWidth = '30%';
          chartContext.w.config.plotOptions.bar.columnWidth = columnWidth;
        },
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
            filename: `${t('speciesPlanted')}`,
          },
          svg: {
            filename: `${t('speciesPlanted')}`,
          },
          png: {
            filename: `${t('speciesPlanted')}`,
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
        columnWidth: '150%',
      },
    },
    dataLabels: {
      enabled: false,
    },

    fill: {
      colors: themeProperties.primaryColor,
    },

    tooltip: {
      custom: function ({ series: s, dataPointIndex, w }) {
        const getToolTip = () => {
          console.log('==>', s, s[0][dataPointIndex]);

          return (
            <Tooltip
              headerTitle={w.globals.categoryLabels[dataPointIndex]}
              bodyTitle={'Planted Species'}
              value={s[0][dataPointIndex]}
            />
          );
        };

        return ReactDOMServer.renderToString(getToolTip());
      },
    },

    xaxis: {
      range: 20,
      max: 20,
      labels: {
        rotate: -90,
        style: {
          cssClass: styles.italics,
        },
      },
      categories: species,
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
      const FILE_NAME = `${project?.name}__${t('speciesPlanted')}__${format(
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

  return (
    <>
      <p>{t('speciesPlanted')}</p>
      <ReactApexChart options={options} series={series} type="bar" />
    </>
  );
};
