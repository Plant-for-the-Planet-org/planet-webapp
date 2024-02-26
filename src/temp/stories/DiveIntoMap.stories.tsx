import type { Meta, StoryObj } from '@storybook/react';
import ProjectView from '../diveButton/DiveIntoMap';

const meta: Meta<typeof ProjectView> = {
  component: ProjectView,
};

export default meta;
type Story = StoryObj<typeof ProjectView>;

export const Preview: Story = {
  args: {
    active: true,
  },
};
