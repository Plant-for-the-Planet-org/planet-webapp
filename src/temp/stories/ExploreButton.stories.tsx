import ExploreButton from '../Explore/ExploreButton';
import type { Meta, StoryObj } from '@storybook/react';
import InfoIcon from '../icons/InfoIcon';

const meta: Meta<typeof ExploreButton> = {
  component: ExploreButton,
};

export default meta;
type Story = StoryObj<typeof ExploreButton>;

export const close: Story = {
  args: {
    label: 'Explore',
    isOpen: false,
    startYear: 0,
    endYear: 0,
  },
};

export const open: Story = {
  args: {
    label: 'Explore',
    isOpen: true,
    startYear: 2001,
    endYear: 2024,
  },
};
