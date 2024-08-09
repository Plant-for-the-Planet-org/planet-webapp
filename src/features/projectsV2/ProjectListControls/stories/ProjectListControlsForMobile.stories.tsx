import ProjectListControlForMobile from '../ProjectListControlForMobile';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectListControlForMobile> = {
  title: 'Projects/Landing/ProjectListControlForMobile',
  component: ProjectListControlForMobile,
};

export default meta;
type Story = StoryObj<typeof ProjectListControlForMobile>;

export const Default: Story = {
  args: {
    projectCount: 20,
    topProjectCount: 30,
    setTabSelected: undefined,
    tabSelected: 'topProjects',
    selectedClassification: [],
    setSelectedClassification: undefined,
    setDebouncedSearchValue: undefined,
    searchProjectResults: [],
    setSelectedMode: undefined,
    selectedMode: 'list',
    isMobile: true,
  },
};
