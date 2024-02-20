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
  },
};
