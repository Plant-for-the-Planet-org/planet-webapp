import ProjectListControlForMobile from '../ProjectListControls/ProjectListControlForMobile';
import type { Meta, StoryObj } from '@storybook/react';
import { Classification } from '../ProjectListControls';

const meta: Meta<typeof ProjectListControlForMobile> = {
  title: 'Projects/Landing/ProjectListControlForMobile',
  component: ProjectListControlForMobile,
};

export default meta;
type Story = StoryObj<typeof ProjectListControlForMobile>;

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
    topProjectCount: 56,
    projectCount: 20,
    availableFilters: availableFilters,
  },
};
