import type { Meta, StoryObj } from '@storybook/react';

import CarbonCapture from '../CarbonCapture/CarbonCapture';

const meta: Meta<typeof CarbonCapture> = {
  component: CarbonCapture,
};

export default meta;
type Story = StoryObj<typeof CarbonCapture>;

export const siteSelected: Story = {
  args: {
    beforeIntervation: 25,
    byProject: 25,
    sitePotential: 100,
    index: 0,
  },
};

export const entireProjectSelected: Story = {
  args: {
    beforeIntervation: 202,
    byProject: 404,
    sitePotential: 100,
    index: 1,
  },
};
