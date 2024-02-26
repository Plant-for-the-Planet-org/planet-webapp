import type { Meta, StoryObj } from '@storybook/react';
import ProjectView from '../diveButton/SingleProjectMap';

const meta: Meta<typeof ProjectView> = {
  component: ProjectView,
};

export default meta;
type Story = StoryObj<typeof ProjectView>;

export const preview: Story = {
  args: {
    active: true,
  },
};
