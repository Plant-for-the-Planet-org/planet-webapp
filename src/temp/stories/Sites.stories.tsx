import type { Meta, StoryObj } from '@storybook/react';
import SiteDropdown from '../ProjectSiteDropdown';

const meta: Meta<typeof SiteDropdown> = {
  component: SiteDropdown,
};

export default meta;
type Story = StoryObj<typeof SiteDropdown>;

const options = [
  {
    name: 'Ean Promsri Rubber Tree Plantation',
    area: 12,
  },
  {
    name: 'Tidarat Chaisawat',
    area: 27,
  },
  {
    name: 'Wiriya Saothong',
    area: 29,
  },
  {
    name: 'Uthai Polmumuang',
    area: 43,
  },
  {
    name: 'Thaisawat Kongchalard',
    area: 21,
  },
];

export const Open: Story = {
  args: {
    siteList: options,
    selectedOption: {
      name: 'Ean Promsri Rubber Tree Plantation',
      area: 12,
    },
    isOpen: true,
  },
};

export const Close: Story = {
  args: {
    siteList: options,
    selectedOption: {
      name: 'Ean Promsri Rubber Tree Plantation',
      area: 12,
    },
    isOpen: false,
  },
};
