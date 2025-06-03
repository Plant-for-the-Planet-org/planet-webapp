import TimeTravelIcon from '../../../../../public/assets/images/icons/TimeTravelIcon';
import type { Meta, StoryObj } from '@storybook/react';
import SingleTab from '../ProjectMapTabs/SingleTab';

const meta: Meta<typeof SingleTab> = {
  title: 'Projects/Details/SingleTab',
  component: SingleTab,
};

export default meta;
type Story = StoryObj<typeof SingleTab>;

export const Selected: Story = {
  args: {
    icon: <TimeTravelIcon color={'#fff'} />,
    title: 'Time Travel',
    isSelected: true,
    onClickHandler: () => {},
  },
};

export const Unselected: Story = {
  args: {
    icon: <TimeTravelIcon color={'#000'} />,
    title: 'Time Travel',
    isSelected: false,
    onClickHandler: () => {},
  },
};
