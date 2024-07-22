import type { Meta, StoryObj } from '@storybook/react';
import Popup from '../../FirePopup';

const meta: Meta<typeof Popup> = {
  title: 'Projects/Details/Popup',
  component: Popup,
};

export default meta;
type Story = StoryObj<typeof Popup>;

export const Open: Story = {
  args: {
    isOpen: true,
  },
};

export const Close: Story = {
  args: {
    isOpen: false,
  },
};
