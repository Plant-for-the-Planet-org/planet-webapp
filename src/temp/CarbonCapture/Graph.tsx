import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import styles from './Graph.module.scss';
import ReactDOMServer from 'react-dom/server';
import NewInfoIcon from '../icons/NewInfoIcon';
import { ApexOptions } from 'apexcharts';
import { useTranslations } from 'next-intl';
import themeProperties from '../../theme/themeProperties';

interface TooltipProps {
  headerTitle: string;
  subTitle: string;
  yoyValue: string;
  date: string;
}

export const Tooltip = ({
  headerTitle,
  subTitle,
  yoyValue,
  date,
}: TooltipProps) => {
  return (
    <div className={styles.tooltipContainer}>
      <div className={styles.header}>
        <p className={styles.title}>{headerTitle}</p>
        <p className={styles.subtitle}>{subTitle}</p>
      </div>
      <div className={styles.body}>
        <p className={styles.yoyValue}>{yoyValue}</p>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
};

interface GraphProps {
  title: string;
  subtitle: string;
  years: number[];
  carbonRemoved: number[];
  biomass: number[];
  tooltip: {
    heading: string;
    unit: string;
    subheading: string;
  };
}

interface CustomTooltipProps {
  dataPointIndex: number;
  w: { config: ApexOptions; globals: any };
}

const Graph = ({
  title,
  subtitle,
  years,
  carbonRemoved,
  biomass,
  tooltip,
}: GraphProps) => {
  const t = useTranslations('ProjectDetails');
  const [xaxisOptions, setXaxisOptions] = useState<
    (number | (string | number)[])[]
  >([]);
  const { light, primaryDarkColorX } = themeProperties;
  useEffect(() => {
    const newOptions = years.map((year, index) => {
      if (index === 1) {
        return [2020, ` ${t('projectLaunch')}`];
      } else {
        return year;
      }
    });
    setXaxisOptions(newOptions);
  }, []);

  const options = {
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.58,
        opacityTo: 0,
      },
    },
    chart: {
      type: 'area',
      width: 300,
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      custom: function ({ dataPointIndex, w }: CustomTooltipProps) {
        const getToolTip = () => {
          const headingTranslation = t(`${tooltip.heading}`);
          const subHeadingTranslation = t(`${tooltip.subheading}`);
          const yoyTranslation = t('yoy', {
            value: 4,
          });
          const dataPoint = xaxisOptions[dataPointIndex];
          const year = Array.isArray(dataPoint) ? dataPoint[0] : dataPoint;

          const headerTitle = `${w.globals.series[0][dataPointIndex]}${tooltip.unit} ${headingTranslation}`;
          const subTitle = subHeadingTranslation
            ? `${w.globals.series[1][dataPointIndex]}${tooltip.unit} ${subHeadingTranslation}`
            : '';
          const date = year.toString();

          return (
            <Tooltip
              headerTitle={headerTitle}
              subTitle={subTitle}
              yoyValue={yoyTranslation}
              date={date}
            />
          );
        };

        return ReactDOMServer.renderToString(getToolTip());
      },
      followCursor: true,
    },
    markers: {
      size: 0,
      colors: [`${light.light}`, 'transparent'],
      strokeColors: [`${primaryDarkColorX}`, 'transparent'],
      strokeOpacity: [1, 1],
      strokeWidth: 2.2,
      hover: {
        size: 6,
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2.2,
    },
    xaxis: {
      type: 'year',
      labels: {
        formatter: function (index: number) {
          if (index === 2) {
            return xaxisOptions[1];
          } else if (index == xaxisOptions.length) {
            return xaxisOptions[index - 1];
          } else {
            return '';
          }
        },
        minHeight: 35,
        style: {
          colors: `${light.grayFontColorNew}`,
          fontSize: 10,
        },
      },
      show: false,
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
    annotations: {
      xaxis: [
        {
          x: xaxisOptions[1],
          strokeDashArray: 0,
          borderColor: `${primaryDarkColorX}`,
        },
      ],
    },
  };
  const series = [
    {
      name: 'series1',
      data: carbonRemoved,
      color: `${primaryDarkColorX}`,
      zIndex: 2,
    },
    {
      name: 'series2',
      data: biomass,
      color: `${light.dividerColorNew}`,
      zIndex: 1,
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h5 className={styles.graphHeading}>
          {title === 'co2CapturePerHa'
            ? t.rich('co2CapturePerHa', {
                captureContainer: (chunk) => <span>{chunk}</span>,
              })
            : t(`${title}`)}
          <div className={styles.newInfoIcon}>
            <NewInfoIcon
              height={17}
              width={17}
              color={`${light.dividerColorNew}`}
            />
          </div>
        </h5>
        <p className={styles.graphSubheading}> {t(`${subtitle}`)}</p>
      </div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={153}
          width={'100%'}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Graph;
