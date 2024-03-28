import SearchProject from '../Project/SearchProject';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchProject> = {
  component: SearchProject,
};

export default meta;
type Story = StoryObj<typeof SearchProject>;

export const inActive: Story = {
  args: {
    isSearch: false,
  },
};

export const active: Story = {
  args: {
    isSearch: true,
  },
};
