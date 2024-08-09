import { differenceInDays, format } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
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
import {
  IDailyFrame,
  IMonthlyFrame,
  IWeeklyFrame,
  IYearlyFrame,
} from '../../../../../common/types/dataExplorer';
import useNextRequest, {
  HTTP_METHOD,
} from '../../../../../../hooks/use-next-request';
import styles from './index.module.scss';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

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
  const t = useTranslations('TreemapperAnalytics');
  const locale = useLocale();

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

  const { makeRequest } = useNextRequest<{
    data: IDailyFrame[] | IWeeklyFrame[] | IMonthlyFrame[] | IYearlyFrame[];
  }>({
    url: `/api/data-explorer/trees-planted?timeFrame=${timeFrame}`,
    method: HTTP_METHOD.POST,
    body: {
      projectId: project?.id,
      startDate: fromDate,
      endDate: toDate,
    },
  });

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
            | string
        ) {
          if (typeof value === 'string') {
            return value; // Return the string value directly
          }
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
          return getFormattedNumber(locale, val);
        },
      },
    },
  });

  // To prevent unnecessary re-render of the Treeplanted component due to the change in timeFrame,
  // track previously rendered value of timeframes
  const previousTimeFrames = useRef({ timeFrames });

  useEffect(() => {
    // setTimeframes only if there is a change in current timeframes and previously rendered timeframes
    if (
      getTimeFrames(toDate, fromDate).length !==
      previousTimeFrames.current.timeFrames.length
    ) {
      setTimeFrames(getTimeFrames(toDate, fromDate));

      // Update value of previousTimeFrames with current timeframes for next render
      previousTimeFrames.current.timeFrames = getTimeFrames(toDate, fromDate);
    }
  }, [toDate, fromDate]);

  useEffect(() => {
    const FILE_NAME = `${project?.name}__${t('treesPlanted')}__${format(
      fromDate,
      'dd-MMM-yy'
    )}__${format(toDate, 'dd-MMM-yy')}`;

    const timeout = setTimeout(() => {
      setOptions((options) => {
        return {
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
                  headerCategory: t('timeFrame'),
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
        };
      });
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [project, toDate, fromDate]);

  function isWeeklyFrame(frame: unknown): frame is IWeeklyFrame {
    const weeklyFrame = frame as IWeeklyFrame;
    return (
      typeof weeklyFrame === 'object' &&
      weeklyFrame !== null &&
      'weekStartDate' in weeklyFrame &&
      'weekEndDate' in weeklyFrame
    );
  }

  function isMonthlyFrame(frame: unknown): frame is IMonthlyFrame {
    const monthlyFrame = frame as IMonthlyFrame;
    return (
      typeof monthlyFrame === 'object' &&
      monthlyFrame !== null &&
      'month' in monthlyFrame &&
      'year' in monthlyFrame
    );
  }

  function addMissingMonths(data: IMonthlyFrame[]) {
    const months = [
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
    ];

    // Extract the first and last month and year from the data
    const firstData = data[0];
    const lastData = data[data.length - 1];
    const firstMonthIndex = months.indexOf(firstData.month);
    const lastMonthIndex = months.indexOf(lastData.month);
    const firstYear = firstData.year;
    const lastYear = lastData.year;

    // Loop through the months and years between the first and last data points
    for (let year = firstYear; year <= lastYear; year++) {
      const startMonth = year === firstYear ? firstMonthIndex : 0;
      const endMonth = year === lastYear ? lastMonthIndex : 11;

      for (let monthIndex = startMonth; monthIndex <= endMonth; monthIndex++) {
        const month = months[monthIndex];

        // Check if the month data is present
        const monthDataExists = data.some(
          (item) => item.month === month && item.year === year
        );

        // If the month data is missing, add it to the data array
        if (!monthDataExists) {
          data.push({ month, year, treesPlanted: 0 });
        }
      }
    }

    // Sort the data array based on year and month
    data.sort((a, b) => {
      if (a.year === b.year) {
        return months.indexOf(a.month) - months.indexOf(b.month);
      }
      return a.year - b.year;
    });

    return data;
  }

  const getPlotingData = (
    tf: TIME_FRAME,
    data: IDailyFrame[] | IWeeklyFrame[] | IMonthlyFrame[] | IYearlyFrame[]
  ) => {
    const treesPlanted: number[] = [];
    const categories: Categories = [];

    // Since there is custom tooltip (refer setOptions in fetchTreesPlanted function) which is
    // unique (using default API [https://apexcharts.com/docs/options/tooltip/] won't give desired results) for each graph,
    // categories needs to the data that need to displayed in the tooltip

    switch (tf) {
      case TIME_FRAME.DAYS:
        data.forEach((tf) => {
          if ('plantedDate' in tf) {
            treesPlanted.push(tf.treesPlanted);

            // Data need to display formatted day in tooltip header (e.g Jan/26/2023)
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

            // Data need to display week range in tooltip header (e.g Jan/26/2022 - Jan/26/2023)
            // and Calender Week at the bottom of every bar (4'CW)
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
          const filledData = addMissingMonths(data as IMonthlyFrame[]);
          filledData.forEach((tf, index) => {
            if (isMonthlyFrame(tf)) {
              treesPlanted.push(tf.treesPlanted);
              const month = t(`${tf.month.toLowerCase()}`);

              // Data need to display month in tooltip header (e.g Jan 2023 or Jan)

              // If the record is a first bar or start of new year append year to it else only display month
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

            // Data need to display week range in tooltip header (e.g 2023)
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
    const res = await makeRequest();

    if (res) {
      const { data } = await res;

      if (timeFrame) {
        const { treesPlanted, categories } = getPlotingData(
          timeFrame,
          data as
            | IDailyFrame[]
            | IWeeklyFrame[]
            | IMonthlyFrame[]
            | IYearlyFrame[]
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
    }
  };

  useEffect(() => {
    // This condition handles the edge case where,
    // Changing the interval between to and from date can change multiple dependencies (namely timeFrame along with to or from date) at the same time.
    // This will result in 2 API calls (eg: one where data is grouped by days and other where data is grouped by weeks)
    // Grouping the data by days takes more time than grouping it by weeks at the backend,
    // due to asynchronous behaviour of JS,
    // client will recieve data grouped by weeks before days which is incorrect.
    // a CHECK of timeFrame inclusion within the range avoides unnecessary call (i.e data grouped by days in this example)

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
      leftElement={<h3 className={styles.title}>{t('treesPlanted')}</h3>}
      rightElement={
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
