import type { Meta, StoryObj } from '@storybook/react';
import Graph from '../CarbonCapture/Graph';

const meta: Meta<typeof Graph> = {
  component: Graph,
};

export default meta;
type Story = StoryObj<typeof Graph>;

const years = [2019, 2020, 2021, 2022, 2023];

export const Preview: Story = {
  args: {
    years: years,
    title: 'co2CapturePerHa',
    subtitle: 'comparedToRegionalAverage',
    series1Values: [21.4, 21.27, 20.78, 21.7, 21.78],
    series2Values: [22.54, 22.65, 21.8, 21.85, 22.03],
    tooltip: {
      heading: 'co2Removed',
      unit: 't',
      subheading: 'biomass',
    },
  },
};
