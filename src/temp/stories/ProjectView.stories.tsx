import type { Meta, StoryObj } from '@storybook/react';
import ProjectView from '../diveButton/ProjectView';

const meta: Meta<typeof ProjectView> = {
  component: ProjectView,
};

export default meta;
type Story = StoryObj<typeof ProjectView>;

export const Selected: Story = {
  args: {
    active: true,
  },
};
