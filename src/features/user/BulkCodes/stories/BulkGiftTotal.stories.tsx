import type { Meta, StoryObj } from '@storybook/react';

import BulkGiftTotal from '../components/BulkGiftTotal';

const meta: Meta<typeof BulkGiftTotal> = {
  title: 'Components/BulkGiftTotal',
  component: BulkGiftTotal,
};

export default meta;

type Story = StoryObj<typeof BulkGiftTotal>;

export const Default: Story = {
  args: {
    amount: 560,
    currency: 'USD',
    units: 500,
    unit: 'tree',
    isImport: false,
  },
};
