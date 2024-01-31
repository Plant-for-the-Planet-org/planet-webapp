import type { Meta, StoryObj } from '@storybook/react';
import SiteDropdown from '../SiteDropdown/SiteDropdown';

const meta: Meta<typeof SiteDropdown> = {
  component: SiteDropdown,
};

export default meta;
type Story = StoryObj<typeof SiteDropdown>;

const options = [
  {
    name: 'Ean Promsri Rubber Tree Plantation',
    area: '12 ha',
  },
  {
    name: 'Tidarat Chaisawat',
    area: '27 ha',
  },
  {
    name: 'Wiriya Saothong',
    area: '29 ha',
  },
  {
    name: 'Uthai Polmumuang',
    area: '43 ha',
  },
  {
    name: 'Thaisawat Kongchalard',
    area: '21 ha',
  },
];

export const Open: Story = {
  args: {
    siteList: options,
    selectedOption: {
      name: 'Ean Promsri Rubber Tree Plantation',
      area: '12 ha',
    },
    isOpen: true,
  },
};

export const Close: Story = {
  args: {
    siteList: options,
    selectedOption: {
      name: 'Ean Promsri Rubber Tree Plantation',
      area: '12 ha',
    },
    isOpen: false,
  },
};
