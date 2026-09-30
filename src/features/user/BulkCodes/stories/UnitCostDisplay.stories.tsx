import type { Meta, StoryObj } from '@storybook/nextjs';

import UnitCostDisplay from '../components/UnitCostDisplay';

const meta: Meta<typeof UnitCostDisplay> = {
  title: 'Components/UnitCostDisplay',
  component: UnitCostDisplay,
};

export default meta;

type Story = StoryObj<typeof UnitCostDisplay>;

export const Default: Story = {
  args: {
    unitCost: 1.12,
    currency: 'USD',
    unit: 'tree',
  },
};
