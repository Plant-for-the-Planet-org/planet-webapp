import React from 'react';
import ReactApexChart from 'react-apexcharts';
import styles from './Graph.module.scss';
import { useTranslation } from 'next-i18next';
import ReactDOMServer from 'react-dom/server';

export const Tooltip = ({ headerTitle, subTitle, yoyValue, date }) => {
  const {
    i18n: { language },
  } = useTranslation();

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

const Graph = ({ years }) => {
  const graphValues = {
    series: [
      {
        name: 'series1',
        data: [21.4, 21.27, 20.78, 21.7, 21.78],
        color: '#219653',
        zIndex: 2,
      },
      {
        name: 'series2',
        data: [22.54, 22.65, 21.8, 21.85, 22.03],
        color: '#BDBDBD',
        zIndex: 1,
      },
    ],
    options: {
      tooltip: {
        custom: function () {
          const getToolTip = () => {
            return (
              <Tooltip
                headerTitle={'6.9t CO2 removed'}
                subTitle={'3.8t Biomass'}
                yoyValue={'+4%'}
                date={'Aug 2020'}
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
      chart: {
        // height: 153.752,
        type: 'area',
        width: 300,
        toolbar: {
          show: false,
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
              return [years[1], 'Project Launch'];
            } else if (index == years.length) {
              return years[index - 1];
            } else {
              return '';
            }
          },
          minHeight: 35,
          style: {
            colors: '#4F4F4F',
            fontSize: 10,
          },
          padding: {
            top: 8, // Increase top padding to provide more space for the second line
          },
        },
        categories: [],
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
            x: [years[1], 'Project Launch'],
            strokeDashArray: 1,
            borderColor: '#4F4F4F',
          },
        ],
      },
    },
  };
  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={graphValues.options}
          series={graphValues.series}
          type="area"
          height={153}
          width={299}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Graph;
