import Dropdown from '../VegetationChangeDatabox/Dropdown';
import type { Meta, StoryObj } from '@storybook/react';
import BiomassChangeIcon from '../icons/BiomassChangeIcon';

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Open: Story = {
  args: {
    labelIcon: <BiomassChangeIcon />,
    labelTitle: 'Biomass Change',
    isOpen: true,
  },
};

export const Close: Story = {
  args: {
    labelIcon: <BiomassChangeIcon />,
    labelTitle: 'Biomass Change',
    isOpen: false,
  },
};
