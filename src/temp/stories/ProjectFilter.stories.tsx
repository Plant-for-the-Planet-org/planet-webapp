import Filter from '../Project/Filter';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Filter> = {
  component: Filter,
};

export default meta;
type Story = StoryObj<typeof Filter>;

export const inActive: Story = {
  args: {
    activeFilter: false,
    ecosystemType: [],
  },
};

export const active = {
  args: {
    activeFilter: true,
    ecosystemType: [
      'Natural Regeneration',
      'Mangroves',
      'Managed Regeneration',
      'Other Restoration',
      'Tree Planting',
      'Agroforestry',
      'Urban Restoration',
      'Conservation',
    ],
  },
};
