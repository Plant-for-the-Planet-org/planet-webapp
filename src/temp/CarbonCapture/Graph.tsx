import React from 'react';
import ReactApexChart from 'react-apexcharts';
import styles from './Graph.module.scss';
import ReactDOMServer from 'react-dom/server';
import NewInfoIcon from '../icons/NewInfoIcon';
import { ApexOptions } from 'apexcharts';

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
        <p className={styles.yoyValue}>
          {yoyValue}
          {'  YoY'}
        </p>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
};

interface GraphProps {
  title: string;
  subtitle: string;
  years: number[];
  series1Values: number[];
  series2Values: number[];
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
  series1Values,
  series2Values,
  tooltip,
}: GraphProps) => {
  const xaxisOptions = years.map((year, index) => {
    if (index === 1) {
      return [2020, ' Project Launch'];
    } else {
      return year;
    }
  });

  const options = {
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
          const dataPoint = xaxisOptions[dataPointIndex];
          const year = Array.isArray(dataPoint) ? dataPoint[0] : dataPoint;
          return (
            <Tooltip
              headerTitle={`${w.globals.series[0][dataPointIndex]}${tooltip.unit} ${tooltip.heading}`}
              subTitle={
                tooltip.subheading
                  ? `${w.globals.series[1][dataPointIndex]}${tooltip.unit} ${tooltip.subheading}`
                  : ''
              }
              yoyValue={'+4%'}
              date={year.toString()}
            />
          );
        };

        return ReactDOMServer.renderToString(getToolTip());
      },
    },
    markers: {
      size: 0,
      colors: ['#fff', 'transparent'],
      strokeColors: ['#219653', 'transparent'],
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
          colors: '#4F4F4F',
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
          strokeDashArray: 1,
          borderColor: '#4F4F4F',
        },
      ],
    },
  };
  const series = [
    {
      name: 'series1',
      data: series1Values,
      color: '#219653',
      zIndex: 2,
    },
    {
      name: 'series2',
      data: series2Values,
      color: '#BDBDBD',
      zIndex: 1,
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h5 className={styles.graphHeading}>
          {title}
          <NewInfoIcon height={17.6} width={17.6} color={'#BDBDBD'} />
        </h5>
        <p className={styles.graphSubheading}>{subtitle}</p>
      </div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={153}
          width={299}
          style={{ display: 'flex', justifyContent: 'center' }}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Graph;
