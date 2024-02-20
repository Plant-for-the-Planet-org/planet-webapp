import type { Meta, StoryObj } from '@storybook/react';
import Graph, { Tooltip } from '../CarbonCapture/Graph';
import ReactDOMServer from 'react-dom/server';

const meta: Meta<typeof Graph> = {
  component: Graph,
};

export default meta;
type Story = StoryObj<typeof Graph>;

const years = [2019, 2020, 2021, 2022, 2023];

export const Preview: Story = {
  args: {
    years: years,
    title: 'CO2 Captured (per ha.)',
    subtitle: 'Compared to regional average',
    series1Values: [21.4, 21.27, 20.78, 21.7, 21.78],
    series2Values: [22.54, 22.65, 21.8, 21.85, 22.03],
    tooltip: {
      heading: 'CO2 removed',
      unit: 't',
      subheading: 'Biomass',
    },
  },
};
