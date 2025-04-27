import type { Meta, StoryObj } from '@storybook/react';
import NavbarMenuItem from '../microComponents/NavbarMenuItem';

const meta: Meta<typeof NavbarMenuItem> = {
  title: 'Components/NavbarMenu/MenuItem',
  component: NavbarMenuItem,
};

export default meta;
type Story = StoryObj<typeof NavbarMenuItem>;

export const NavbarMenuItemView: Story = {
  args: {
    headerKey: 'platform',
    description: 'platformDescription',
    title: 'platform',
    link: 'https://www.plant-for-the-planet.org/',
    visible: true,
  },
};
