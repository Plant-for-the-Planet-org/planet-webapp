import type { Meta, StoryObj } from '@storybook/react';

import CarbonCapture from '../CarbonCapture/CarbonCapture';

const meta: Meta<typeof CarbonCapture> = {
  component: CarbonCapture,
};

export default meta;
type Story = StoryObj<typeof CarbonCapture>;

export const Selected: Story = {
  args: {
    beforeIntervation: `${262626262}`,
    byProject: `${262626262}`,
    sitePotential: `${262626262}`,
  },
};
