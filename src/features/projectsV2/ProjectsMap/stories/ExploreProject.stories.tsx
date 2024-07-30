import ExploreProject from '../Explore/ExploreProject';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ExploreProject> = {
  title: 'Projects/Landing/ExploreProject',
  component: ExploreProject,
};

export default meta;
type Story = StoryObj<typeof ExploreProject>;

export const Default: Story = {};
