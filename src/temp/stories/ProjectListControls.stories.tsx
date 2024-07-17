import ProjectListControls from '../ProjectListControls';
import type { Meta, StoryObj } from '@storybook/react';
import { Classification } from '../ProjectListControls';

const meta: Meta<typeof ProjectListControls> = {
  title: 'Projects/Landing/ProjectListControls',
  component: ProjectListControls,
};

export default meta;
type Story = StoryObj<typeof ProjectListControls>;

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
    topProjectCount: 20,
    projectCount: 10,
  },
};
