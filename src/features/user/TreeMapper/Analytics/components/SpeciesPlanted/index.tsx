import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import themeProperties from '../../../../../../theme/themeProperties';
import { getFormattedNumber } from '../../../../../../utils/getFormattedNumber';
import styles from './index.module.scss';
import { Tooltip } from './Tooltip';
import DownloadSolid from '../../../../../../../public/assets/images/icons/share/DownloadSolid';
import ReactDOMServer from 'react-dom/server';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import { format } from 'date-fns';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface Species {
  other_species: null | string;
  scientific_species_id: number;
  name: null | string;
  total_tree_count: number;
}

const getDownloadIcon = () => {
  return <DownloadSolid color="#6E8091" />;
};

export const SpeciesPlanted = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation(['treemapperAnalytics']);

  const { project, fromDate, toDate } = useAnalytics();

  const [series, setSeries] = useState<ApexAxisChartSeries>([
    {
      data: [],
    },
  ]);

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      // events: {
      //   beforeZoom: function (ctx) {
      //     ctx.w.config.xaxis.range = undefined;
      //   },
      //   zoomed: function (chartContext, { xaxis }) {
      //     // calculate the new columnWidth based on the zoomed range

      //     const { max, min } = xaxis;
      //     let columnWidth: number | string = Math.abs(
      //       Math.ceil((max - min) / 10)
      //     );

      //     if (columnWidth <= 3) columnWidth = '200%';
      //     else columnWidth = '30%';
      //     chartContext.w.config.plotOptions.bar.columnWidth = columnWidth;
      //   },
      // },
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
        columnWidth: '30%',
      },
    },
    dataLabels: {
      enabled: false,
    },

    fill: {
      colors: [themeProperties.primaryColor],
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
      // range: 20,
      // max: 20,
      labels: {
        rotate: -90,
        style: {
          cssClass: styles.italics,
        },
        trim: true,
      },
      categories: [],
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
      logarithmic: true, //open bug that causes data labels to render wrong numbers
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
            ...options!.chart!.toolbar,
            export: {
              ...options!.chart!.toolbar!.export,
              csv: {
                ...options!.chart!.toolbar!.export!.csv,
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

  const getPlotingData = (speciesData: Species[]) => {
    const speciesPlanted: number[] = [];
    const categories: string[] = [];

    for (const species of speciesData) {
      speciesPlanted.push(species.total_tree_count);
      categories.push(species.name as string);
    }

    return { speciesPlanted, categories };
  };

  const fetchPlantedSpecies = async () => {
    const res = await fetch('/api/analytics/species-planted', {
      method: 'POST',
      body: JSON.stringify({
        projectId: project!.id,
        startDate: fromDate,
        endDate: toDate,
      }),
    });
    const { data }: { data: Species[] } = await res.json();

    let unknownIndex = -1;

    const speciesData = data.map((species, index) => {
      if (species.other_species === 'Unknown') {
        unknownIndex = index;
      }
      if (!species.name && species.other_species !== 'Unknown') {
        return { ...species, name: species.other_species };
      }
      return species;
    });

    if (unknownIndex !== -1) {
      const unknownSpecies = speciesData.splice(unknownIndex, 1)[0];
      speciesData.push({
        ...unknownSpecies,
        name: unknownSpecies.other_species,
      });
    }

    const { speciesPlanted, categories } = getPlotingData(speciesData);

    setSeries([
      {
        data: speciesPlanted,
        name: t('speciesPlanted'),
      },
    ]);

    setOptions({
      ...options,
      xaxis: { ...options.xaxis, categories: categories },
    });
  };

  useEffect(() => {
    if (project) {
      fetchPlantedSpecies();
    }
  }, [project, fromDate, toDate]);

  return (
    <>
      <p>{t('speciesPlanted')}</p>
      <ReactApexChart options={options} series={series} type="bar" />
    </>
  );
};
