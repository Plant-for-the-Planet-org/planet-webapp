import SatelliteIcon from '../../../public/assets/images/icons/SatelliteIcon';
import type { Meta, StoryObj } from '@storybook/react';
import SingleTab from '../ProjectViewTabs/SingleTab';

const meta: Meta<typeof SingleTab> = {
  component: SingleTab,
};

export default meta;
type Story = StoryObj<typeof SingleTab>;

export const TimeTravelSelected: Story = {
  args: {
    icon: <SatelliteIcon color={'#fff'} />,
    title: 'Time Travel',
    isSelected: true,
  },
};

export const TimeTravelUnSelected: Story = {
  args: {
    icon: <SatelliteIcon color={'#000'} />,
    title: 'Time Travel',
    isSelected: false,
  },
};
