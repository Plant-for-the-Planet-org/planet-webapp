import type { Meta, StoryObj } from '@storybook/react';
import Graph from '../CarbonCapture/Graph';

const meta: Meta<typeof Graph> = {
  component: Graph,
};

export default meta;
type Story = StoryObj<typeof Graph>;

const years = [2019, 2020, 2021, 2022, 2023];

export const CarbonCapture: Story = {
  args: {
    years: years,
    byProjectResult: [23.4, 23.27, 23.78, 23.7, 23.78],
    regionalAverage: [22.54, 22.65, 21.8, 21.85, 22.03],
    type: 'carbonCapture',
  },
};

export const CanopyCover: Story = {
  args: {
    years: years,
    byProjectResult: [23, 24, 25, 26, 27],
    regionalAverage: [19, 20, 21, 22, 23],
    type: 'canopyCover',
  },
};
