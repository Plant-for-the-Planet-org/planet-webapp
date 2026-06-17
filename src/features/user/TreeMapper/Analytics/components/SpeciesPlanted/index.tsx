import type { ApexOptions } from 'apexcharts';
import type { ISpeciesPlanted } from '../../../../../common/types/dataExplorer';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import themeProperties from '../../../../../../theme/themeProperties';
import { getFormattedNumber } from '../../../../../../utils/getFormattedNumber';
import styles from './index.module.scss';
import { Tooltip } from './Tooltip';
import DownloadSolid from '../../../../../../../public/assets/images/icons/share/DownloadSolid';
import ReactDOMServer from 'react-dom/server';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import { format } from 'date-fns';
import { Container } from '../Container';
import useNextRequest, {
  HTTP_METHOD,
} from '../../../../../../hooks/use-next-request';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const getDownloadIcon = () => {
  return (
    <DownloadSolid color={themeProperties.designSystem.colors.softText2} />
  );
};

export const SpeciesPlanted = () => {
  const t = useTranslations('TreemapperAnalytics');
  const locale = useLocale();

  const { project, fromDate, toDate } = useAnalytics();

  const { makeRequest } = useNextRequest<{ data: ISpeciesPlanted[] }>({
    url: '/api/data-explorer/species-planted',
    method: HTTP_METHOD.POST,
    body: {
      projectId: project?.guid,
      startDate: fromDate,
      endDate: toDate,
    },
  });

  const [series, setSeries] = useState<ApexOptions['series']>([
    {
      data: [],
    },
  ]);

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: 'bar',
      toolbar: {
        show: true,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
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
      colors: [themeProperties.designSystem.colors.warmGreen],
    },

    tooltip: {
      custom: function ({ series: s, dataPointIndex, w }) {
        const getToolTip = () => {
          return (
            <Tooltip
              headerTitle={w.globals.categoryLabels[dataPointIndex]}
              bodyTitle={'Planted Species'}
              value={s[0][dataPointIndex]}
              locale={locale}
            />
          );
        };

        return ReactDOMServer.renderToString(getToolTip());
      },
    },

    xaxis: {
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
            colorFrom: `${themeProperties.designSystem.colors.mediumGrey}`,
            colorTo: `${themeProperties.designSystem.colors.skyBlue}`,
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tickPlacement: 'on',
    },
    yaxis: {
      logarithmic: false, //open bug that causes data labels to render wrong numbers
      axisBorder: {
        show: true,
      },
      labels: {
        show: true,
        formatter: function (val) {
          return getFormattedNumber(locale, val);
        },
      },
    },
  });

  const getPlottingData = (speciesData: ISpeciesPlanted[]) => {
    const speciesPlanted: number[] = [];
    const categories: string[] = [];

    for (const species of speciesData) {
      speciesPlanted.push(species.total_tree_count);
      categories.push(species.name as string);
    }

    return { speciesPlanted, categories };
  };

  const fetchPlantedSpecies = async () => {
    const res = await makeRequest();

    if (res) {
      const { data } = res;

      // In the graph Unknown species needs to be displayed at the end.

      let unknownIndex = -1;

      // Create speciesData while checking for unknown species
      const speciesData = data.map((species, index) => {
        if (species.other_species === 'Unknown') {
          unknownIndex = index;
        }
        return species;
      });

      // If unknown species is found append it at the end of speciesData
      if (unknownIndex !== -1) {
        const unknownSpecies = speciesData.splice(unknownIndex, 1)[0];
        speciesData.push({
          ...unknownSpecies,
          name: unknownSpecies.other_species,
        });
      }

      const { speciesPlanted, categories } = getPlottingData(speciesData);

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
    }
  };

  useEffect(() => {
    const FILE_NAME = `${project?.name}__${t('speciesPlanted')}__${format(
      fromDate,
      'dd-MMM-yy'
    )}__${format(toDate, 'dd-MMM-yy')}`;

    const timeout = setTimeout(() => {
      setOptions({
        ...options,
        chart: {
          ...options.chart,
          toolbar: {
            ...options.chart?.toolbar,
            export: {
              ...options.chart?.toolbar?.export,
              csv: {
                ...options.chart?.toolbar?.export?.csv,
                filename: FILE_NAME,
                headerCategory: t('scientificName'),
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
    }, 2000);

    if (process.env.ENABLE_ANALYTICS && project) {
      fetchPlantedSpecies();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [project, fromDate, toDate]);

  return (
    <Container
      leftElement={<h3 className={styles.title}>{t('speciesPlanted')}</h3>}
    >
      <ReactApexChart options={options} series={series} type="bar" />
    </Container>
  );
};
