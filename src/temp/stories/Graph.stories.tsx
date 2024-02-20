import type { Meta, StoryObj } from '@storybook/react';
import Graph from '../CarbonCapture/Graph';

const meta: Meta<typeof Graph> = {
  component: Graph,
};

export default meta;
type Story = StoryObj<typeof Graph>;

const graphValues = {
  series: [
    {
      name: 'series1',
      data: [31, 40, 28, 51, 42, 109, 100],
      color: '#219653',
    },
    {
      name: 'series2',
      data: [11, 32, 45, 32, 34, 52, 41],
      color: '#BDBDBD',
      strokeWidth: 1.202,
    },
  ],
  options: {
    chart: {
      height: 153.752,
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
    },
    xaxis: {
      type: 'year',
      categories: ['2018', '2023'],
      // min: 2018,
      // max: 2023,
      stepSize: 6,
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
  },
};

export const TabsView: Story = {
  args: {
    graphData: graphValues,
  },
};
