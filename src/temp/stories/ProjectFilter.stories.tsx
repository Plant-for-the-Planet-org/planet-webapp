import Filter, { Classification } from '../ProjectListControls/Filter';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Filter> = {
  component: Filter,
};

export default meta;
type Story = StoryObj<typeof Filter>;

export interface FilterState {
  availableFilters: Classification[];
  filterApplied: Classification | undefined;
}

const filterState: FilterState = {
  availableFilters: [
    'large-scale-planting',
    'agroforestry',
    'natural-regeneration',
    'managed-regeneration',
    'urban-planting',
    'other-planting',
  ],
  filterApplied: 'large-scale-planting',
};

const setFilterApplied = (value: Classification | undefined) => {
  window.alert(`${value} is selected`);
};

export const Default: Story = {
  args: {
    filterApplied: filterState.filterApplied,
    setFilterApplied: setFilterApplied,
    availableFilters: filterState.availableFilters,
  },
};
