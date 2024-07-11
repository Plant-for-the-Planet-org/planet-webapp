import Filter, { Classification } from '../ProjectListControls/Filter';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Filter> = {
  component: Filter,
};

export default meta;
type Story = StoryObj<typeof Filter>;

const availableFilters: Classification[] = [
  'large-scale-planting',
  'agroforestry',
  'natural-regeneration',
  'managed-regeneration',
  'urban-planting',
  'other-planting',
];

export const Default: Story = {
  args: {
    availableFilters: availableFilters,
  },
};
