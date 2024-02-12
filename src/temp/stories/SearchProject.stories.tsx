import SearchProject from '../Project/SearchProject';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchProject> = {
  component: SearchProject,
};

export default meta;
type Story = StoryObj<typeof SearchProject>;

export const SearchInActive: Story = {
  args: {
    activeFilter: false,
    projectList: [
      'Natural Regeneration',
      'Mangroves',
      'Managed Regeneration',
      'Other Restoration',
      'Tree Planting',
      'Agroforestry',
      'Urban Restoration',
      'Conservation',
    ],
    searchActive: false,
  },
};

export const SearchActive: Story = {
  args: {
    activeFilter: false,
    projectList: [],
    searchActive: true,
  },
};
