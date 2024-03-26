import type { Meta, StoryObj } from '@storybook/react';
import VegetationSlider from '../VegetationChangeDatabox/VegetationSlider';

const meta: Meta<typeof VegetationSlider> = {
  component: VegetationSlider,
};

export default meta;
type Story = StoryObj<typeof VegetationSlider>;

export const Preview: Story = {
  args: {
    position: 5,
  },
};
