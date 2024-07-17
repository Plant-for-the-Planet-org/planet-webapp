import ExploreProject from '../../Explore/ExploreProject';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ExploreProject> = {
  title: 'Landing Page/ExploreProject',
  component: ExploreProject,
};

export default meta;
type Story = StoryObj<typeof ExploreProject>;

export const Default: Story = {};
