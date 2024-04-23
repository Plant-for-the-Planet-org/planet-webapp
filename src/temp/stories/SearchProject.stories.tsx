import SearchProject from '../Project/SearchProject';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterState } from './ProjectFilter.stories';
import { Classification } from '../Project/Filter';

const meta: Meta<typeof SearchProject> = {
  component: SearchProject,
};

export default meta;
type Story = StoryObj<typeof SearchProject>;

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
