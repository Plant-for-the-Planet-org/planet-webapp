import ExploreButton from '../Explore/ExploreButton';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ExploreButton> = {
  component: ExploreButton,
};

export default meta;
type Story = StoryObj<typeof ExploreButton>;

export const close: Story = {
  args: {
    label: 'Explore',
  },
};
