import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './index.module.scss';
import themeProperties from '../../../../../../theme/themeProperties';
import { getFormattedNumber } from '../../../../../../utils/getFormattedNumber';
import {
  getTimeFrames,
  TIME_FRAMES,
  useAnalytics,
} from '../../../../../common/Layout/AnalyticsContext';
import DownloadSolid from '../../../../../../../public/assets/images/icons/share/DownloadSolid';
import ReactDOMServer from 'react-dom/server';
import { ApexOptions } from 'apexcharts';
import { Tooltip } from './Tooltip';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface DailyFrame {
  plantedDate: string;
  treesPlanted: number;
}

interface WeeklyFrame {
  weekStartDate: string;
  weekEndDate: string;
  weekNum: number;
  month: string;
  year: number;
  treesPlanted: number;
}

interface MonthlyFrame {
  month: string;
  year: number;
  treesPlanted: number;
}

interface YearlyFrame {
  year: number;
  treesPlanted: number;
}

interface DaysCategories {
  label: string;
}

interface WeeksCategories {
  label: string;
  weekStateDate: string;
  weekEndDate: string;
}

interface MonthsCategories {
  label: string;
  month: string;
  year: number;
}

interface YearsCategories {
  label: string;
}

type Categories =
  | DaysCategories[]
  | WeeksCategories[]
  | MonthsCategories[]
  | YearsCategories[];

export const TreePlanted = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation(['treemapperAnalytics']);

  const [series, setSeries] = useState<ApexAxisChartSeries>([
    {
      data: [],
    },
  ]);

  const { project, fromDate, toDate, timeFrame } = useAnalytics();

  const getDownloadIcon = () => {
    return <DownloadSolid color="#6E8091" />;
  };

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
        columnWidth: '30%',
      },
    },
    dataLabels: {
      enabled: false,
    },

    fill: {
      colors: [themeProperties.primaryColor],
    },

    xaxis: {
      // range: 20,
      // max: 20,
      labels: {
        rotate: -90,
        formatter: function (
          value:
            | DaysCategories
            | WeeksCategories
            | MonthsCategories
            | YearsCategories
        ) {
          return value ? value.label : '';
        },
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

  function isWeeklyFrame(frame: any): frame is WeeklyFrame {
    return 'weekStartDate' in frame && 'weekEndDate' in frame;
  }

  function isMonthlyFrame(frame: any): frame is MonthlyFrame {
    return 'month' in frame && 'year' in frame;
  }

  const getPlotingData = (
    tf: TIME_FRAMES,
    data: DailyFrame[] | WeeklyFrame[] | MonthlyFrame[] | YearlyFrame[]
  ) => {
    const treesPlanted: number[] = [];
    const categories: Categories = [];

    switch (tf) {
      case TIME_FRAMES.DAYS:
        data.forEach((tf) => {
          if ('plantedDate' in tf) {
            treesPlanted.push(tf.treesPlanted);
            (categories as DaysCategories[]).push({
              label: format(new Date(tf.plantedDate), 'MMM/dd/yyyy'),
            });
          }
        });
        break;

      case TIME_FRAMES.WEEKS:
        data.forEach((tf) => {
          if (isWeeklyFrame(tf)) {
            treesPlanted.push(tf.treesPlanted);
            (categories as WeeksCategories[]).push({
              label: `${tf.weekNum}'${t('calenderWeek')}`,
              weekStateDate: format(new Date(tf.weekStartDate), 'MMM/dd/yy'),
              weekEndDate: format(new Date(tf.weekEndDate), 'MMM/dd/yy'),
            });
          }
        });
        break;

      case TIME_FRAMES.MONTHS:
        {
          let year = 0;
          data.forEach((tf, index) => {
            if (isMonthlyFrame(tf)) {
              treesPlanted.push(tf.treesPlanted);
              const month = t(`${tf.month.toLowerCase()}`);
              if (tf.year > year || index === 0) {
                (categories as MonthsCategories[]).push({
                  label: `${month}'${tf.year}`,
                  month: tf.month,
                  year: tf.year,
                });
                year = tf.year;
              } else {
                (categories as MonthsCategories[]).push({
                  label: `${month}`,
                  month: tf.month,
                  year: tf.year,
                });
              }
            }
          });
        }
        break;

      case TIME_FRAMES.YEARS:
        data.forEach((tf) => {
          if ('year' in tf) {
            treesPlanted.push(tf.treesPlanted);
            (categories as YearsCategories[]).push({
              label: `${tf.year}`,
            });
          }
        });
        break;
    }

    return { treesPlanted, categories };
  };

  const getToolTip = (
    seriesData: number[],
    dataPointIndex: number,
    categories: Categories
  ) => {
    switch (timeFrame) {
      case TIME_FRAMES.DAYS:
        return (
          <Tooltip
            headerTitle={(categories as DaysCategories[])[dataPointIndex].label}
            bodyTitle={t('treesPlanted')}
            value={`${seriesData[dataPointIndex]}`}
          />
        );
      case TIME_FRAMES.WEEKS:
        return (
          <Tooltip
            headerTitle={`${
              (categories as WeeksCategories[])[dataPointIndex].weekStateDate
            } - ${
              (categories as WeeksCategories[])[dataPointIndex].weekEndDate
            }`}
            bodyTitle={t('treesPlanted')}
            value={`${seriesData[dataPointIndex]}`}
          />
        );
      case TIME_FRAMES.MONTHS:
        return (
          <Tooltip
            headerTitle={`${
              (categories as MonthsCategories[])[dataPointIndex].month
            } ${(categories as MonthsCategories[])[dataPointIndex].year}`}
            bodyTitle={t('treesPlanted')}
            value={`${seriesData[dataPointIndex]}`}
          />
        );
      case TIME_FRAMES.YEARS:
        return (
          <Tooltip
            headerTitle={(categories as DaysCategories[])[dataPointIndex].label}
            bodyTitle={t('treesPlanted')}
            value={`${seriesData[dataPointIndex]}`}
          />
        );
      default:
        return <></>;
    }
  };

  const fetchPlantedTrees = async () => {
    const res = await fetch(
      `/api/analytics/trees-planted?timeFrame=${timeFrame}`,
      {
        method: 'POST',
        body: JSON.stringify({
          projectId: project!.id,
          startDate: fromDate,
          endDate: toDate,
        }),
      }
    );
    const { data } = await res.json();

    const { treesPlanted, categories } = getPlotingData(
      timeFrame!,
      data as DailyFrame[] | WeeklyFrame[] | MonthlyFrame[] | YearlyFrame[]
    );

    setSeries([
      {
        data: treesPlanted,
        name: t('treesPlanted'),
      },
    ]);

    setOptions({
      ...options,
      xaxis: {
        ...options.xaxis,
        categories: categories,
      },
      tooltip: {
        custom: function ({ series: s, dataPointIndex }) {
          const seriesData: number[] = s[0];

          return ReactDOMServer.renderToString(
            getToolTip(seriesData, dataPointIndex, categories)
          );
        },
      },
    });
  };

  useEffect(() => {
    const isValidTimeFrame = getTimeFrames(toDate, fromDate).includes(
      timeFrame!
    );
    if (process.env.ENABLE_ANALYTIC && isValidTimeFrame && project) {
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
