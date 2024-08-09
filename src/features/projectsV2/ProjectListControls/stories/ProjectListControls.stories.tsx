import ProjectListControls from '..';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectListControls> = {
  title: 'Projects/Landing/ProjectListControls',
  component: ProjectListControls,
};

export default meta;
type Story = StoryObj<typeof ProjectListControls>;

export const Default: Story = {
  args: {
    projectCount: 20,
    topProjectCount: 30,
    setTabSelected: undefined,
    tabSelected: 0,
    selectedClassification: [],
    setSelectedClassification: undefined,
    setDebouncedSearchValue: undefined,
    searchProjectResults: [],
  },
};
