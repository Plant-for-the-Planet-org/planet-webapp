import type { Meta, StoryObj } from '@storybook/react';
import Databox from '../VegetationChangeDatabox/Databox';

const meta: Meta<typeof Databox> = {
  component: Databox,
};

export default meta;
type Story = StoryObj<typeof Databox>;

export const Preview: Story = {
  args: {
    startYear: 2018,
  },
};
