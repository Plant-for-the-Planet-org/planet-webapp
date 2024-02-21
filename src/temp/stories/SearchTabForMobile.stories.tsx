import SearchTabForMobile from '../Project/SearchTabForMobile';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchTabForMobile> = {
  component: SearchTabForMobile,
};

export default meta;
type Story = StoryObj<typeof SearchTabForMobile>;

export const SearchInActive: Story = {
  args: {
    active: true,
  },
};
