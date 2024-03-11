import Filter from '../Project/Filter';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Filter> = {
  component: Filter,
};

export default meta;
type Story = StoryObj<typeof Filter>;

export const inActive: Story = {
  args: {
    isFilter: false,
  },
};

export const active = {
  args: {
    isFilter: true,
  },
};
