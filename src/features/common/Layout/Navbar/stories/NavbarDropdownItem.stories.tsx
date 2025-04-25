import type { Meta, StoryObj } from '@storybook/react';
import NavbarDropdownItem from '../microComponents/NavbarDropdownItem';

const meta: Meta<typeof NavbarDropdownItem> = {
  title: 'Components/NavbarDropdown/DropdownItem',
  component: NavbarDropdownItem,
};

export default meta;
type Story = StoryObj<typeof NavbarDropdownItem>;

export const NavbarDropdownItemView: Story = {
  args: {
    headerKey: 'platform',
    description: 'platformDescription',
    title: 'platform',
    link: 'https://www.plant-for-the-planet.org/',
    visible: true,
  },
};
