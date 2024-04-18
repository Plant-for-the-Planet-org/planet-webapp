import ExploreProject from '../Explore/ExploreProject';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ExploreProject> = {
  component: ExploreProject,
};

export default meta;
type Story = StoryObj<typeof ExploreProject>;

export const Close: Story = {
  args: {
    startYear: 2001,
    endYear: 2024,
  },
};

export const Open: Story = {
  args: {
    startYear: 2001,
    endYear: 2024,
  },
};
