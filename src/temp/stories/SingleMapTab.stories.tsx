import SatelliteIcon from '../../../public/assets/images/icons/SatelliteIcon';
import type { Meta, StoryObj } from '@storybook/react';
import SingleTab from '../ProjectMapTabs/SingleTab';

const meta: Meta<typeof SingleTab> = {
  component: SingleTab,
};

export default meta;
type Story = StoryObj<typeof SingleTab>;

export const Selected: Story = {
  args: {
    icon: <SatelliteIcon color={'#fff'} />,
    title: 'Time Travel',
    isSelected: true,
  },
};

export const Unselected: Story = {
  args: {
    icon: <SatelliteIcon color={'#000'} />,
    title: 'Time Travel',
    isSelected: false,
  },
};
