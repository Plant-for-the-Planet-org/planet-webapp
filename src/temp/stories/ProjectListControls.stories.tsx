import ProjectListControls from '../ProjectListControls';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterState } from './ProjectFilter.stories';
import { Classification } from '../ProjectListControls/Filter';

const meta: Meta<typeof ProjectListControls> = {
  component: ProjectListControls,
};

export default meta;
type Story = StoryObj<typeof ProjectListControls>;

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
    topProjectCount: 20,
    projectCount: 10,
  },
};
