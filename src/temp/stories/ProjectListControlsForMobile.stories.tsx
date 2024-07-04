import ProjectListControlForMobile from '../ProjectListControls/ProjectListControlForMobile';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterState } from './ProjectFilter.stories';
import { Classification } from '../ProjectListControls/Filter';

const meta: Meta<typeof ProjectListControlForMobile> = {
  component: ProjectListControlForMobile,
};

export default meta;
type Story = StoryObj<typeof ProjectListControlForMobile>;

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
    topProjectCount: 56,
    projectCount: 20,
    filterApplied: filterState.filterApplied,
    setFilterApplied: setFilterApplied,
    availableFilters: filterState.availableFilters,
  },
};
