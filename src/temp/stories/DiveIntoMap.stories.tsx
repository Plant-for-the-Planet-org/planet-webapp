import type { Meta, StoryObj } from '@storybook/react';
import DiveIntoMap from '../diveButton/DiveIntoMap';

const meta: Meta<typeof DiveIntoMap> = {
  component: DiveIntoMap,
};

export default meta;
type Story = StoryObj<typeof DiveIntoMap>;

export const Preview: Story = {
  args: {
    active: true,
  },
};
