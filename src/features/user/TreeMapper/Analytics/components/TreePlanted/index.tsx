import { differenceInDays, format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import themeProperties from '../../../../../../theme/themeProperties';
import { getFormattedNumber } from '../../../../../../utils/getFormattedNumber';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import DownloadSolid from '../../../../../../../public/assets/images/icons/share/DownloadSolid';
import ReactDOMServer from 'react-dom/server';
import { ApexOptions } from 'apexcharts';
import { Tooltip } from './Tooltip';
import { Container } from '../Container';
import TimeFrameSelector, { TIME_FRAME } from './TimeFrameSelector';
import { ErrorHandlingContext } from '../../../../../common/Layout/ErrorHandlingContext';

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

const ONE_YEAR_DAYS = 365;
const TWO_YEARS_DAYS = 2 * ONE_YEAR_DAYS;
const FIVE_YEARS_DAYS = 5 * ONE_YEAR_DAYS;

export const getTimeFrames = (toDate: Date, fromDate: Date) => {
  const diffInDays = differenceInDays(toDate, fromDate);

  switch (true) {
    case diffInDays <= ONE_YEAR_DAYS:
      return [
        TIME_FRAME.DAYS,
        TIME_FRAME.WEEKS,
        TIME_FRAME.MONTHS,
        TIME_FRAME.YEARS,
      ];
    case diffInDays <= TWO_YEARS_DAYS:
      return [TIME_FRAME.WEEKS, TIME_FRAME.MONTHS, TIME_FRAME.YEARS];
    case diffInDays <= FIVE_YEARS_DAYS:
      return [TIME_FRAME.MONTHS, TIME_FRAME.YEARS];
    default:
      return [TIME_FRAME.YEARS];
  }
};

export const TreePlanted = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation(['treemapperAnalytics']);

  const { handleError } = useContext(ErrorHandlingContext);

  const [series, setSeries] = useState<ApexOptions['series']>([
    {
      data: [],
    },
  ]);

  const { project, fromDate, toDate } = useAnalytics();

  const [timeFrames, setTimeFrames] = useState<TIME_FRAME[]>(
    getTimeFrames(toDate, fromDate)
  );

  const [timeFrame, setTimeFrame] = useState<TIME_FRAME | null>(null);

  const getDownloadIcon = () => {
    return <DownloadSolid color="#6E8091" />;
  };

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

  const previousTimeFrame = useRef({ timeFrames });

  useEffect(() => {
    if (
      getTimeFrames(toDate, fromDate).length !==
      previousTimeFrame.current.timeFrames.length
    ) {
      setTimeFrames(getTimeFrames(toDate, fromDate));
      previousTimeFrame.current.timeFrames = getTimeFrames(toDate, fromDate);
    }
  }, [toDate, fromDate]);

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
            ...options.chart?.toolbar,
            export: {
              ...options.chart?.toolbar?.export,
              csv: {
                ...options.chart?.toolbar?.export?.csv,
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

  function isWeeklyFrame(frame: unknown): frame is WeeklyFrame {
    const weeklyFrame = frame as WeeklyFrame;
    return (
      typeof weeklyFrame === 'object' &&
      weeklyFrame !== null &&
      'weekStartDate' in weeklyFrame &&
      'weekEndDate' in weeklyFrame
    );
  }

  function isMonthlyFrame(frame: unknown): frame is MonthlyFrame {
    const monthlyFrame = frame as MonthlyFrame;
    return (
      typeof monthlyFrame === 'object' &&
      monthlyFrame !== null &&
      'month' in monthlyFrame &&
      'year' in monthlyFrame
    );
  }

  const getPlotingData = (
    tf: TIME_FRAME,
    data: DailyFrame[] | WeeklyFrame[] | MonthlyFrame[] | YearlyFrame[]
  ) => {
    const treesPlanted: number[] = [];
    const categories: Categories = [];

    switch (tf) {
      case TIME_FRAME.DAYS:
        data.forEach((tf) => {
          if ('plantedDate' in tf) {
            treesPlanted.push(tf.treesPlanted);
            (categories as DaysCategories[]).push({
              label: format(new Date(tf.plantedDate), 'MMM/dd/yyyy'),
            });
          }
        });
        break;

      case TIME_FRAME.WEEKS:
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

      case TIME_FRAME.MONTHS:
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

      case TIME_FRAME.YEARS:
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
      case TIME_FRAME.DAYS:
        return (
          <Tooltip
            headerTitle={(categories as DaysCategories[])[dataPointIndex].label}
            bodyTitle={t('treesPlanted')}
            value={`${seriesData[dataPointIndex]}`}
          />
        );
      case TIME_FRAME.WEEKS:
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
      case TIME_FRAME.MONTHS:
        return (
          <Tooltip
            headerTitle={`${
              (categories as MonthsCategories[])[dataPointIndex].month
            } ${(categories as MonthsCategories[])[dataPointIndex].year}`}
            bodyTitle={t('treesPlanted')}
            value={`${seriesData[dataPointIndex]}`}
          />
        );
      case TIME_FRAME.YEARS:
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
    // TODO - Once error handling PR is merged refactor this fetch call with a makeNextRequest function

    const res = await fetch(
      `/api/data-explorer/trees-planted?timeFrame=${timeFrame}`,
      {
        method: 'POST',
        body: JSON.stringify({
          projectId: project?.id,
          startDate: fromDate,
          endDate: toDate,
        }),
      }
    );

    if (res.status === 429) {
      handleError({ message: t('errors.tooManyRequest'), type: 'error' });
      return;
    }

    const { data } = await res.json();

    if (timeFrame) {
      const { treesPlanted, categories } = getPlotingData(
        timeFrame,
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
    }
  };

  useEffect(() => {
    const isValidTimeFrame =
      timeFrame && getTimeFrames(toDate, fromDate).includes(timeFrame);
    if (process.env.ENABLE_ANALYTICS && isValidTimeFrame && project) {
      fetchPlantedTrees();
    }
  }, [project, fromDate, toDate, timeFrame]);

  const handleTimeFrameChange = (tf: TIME_FRAME | null) => {
    setTimeFrame(tf);
  };

  return (
    <Container
      title={t('treesPlanted')}
      options={
        <TimeFrameSelector
          handleTimeFrameChange={handleTimeFrameChange}
          timeFrames={timeFrames}
          timeFrame={timeFrame ?? null}
        />
      }
    >
      <ReactApexChart options={options} series={series} type="bar" />
    </Container>
  );
};
