import type { Meta, StoryObj } from '@storybook/react';

import TimeTravelIcon from '../../../../../public/assets/images/icons/TimeTravelIcon';
import SingleTab from '../ProjectMapTabs/SingleTab';
import themeProperties from '../../../../theme/themeProperties';

const { colors } = themeProperties.designSystem;
const meta: Meta<typeof SingleTab> = {
  title: 'Projects/Details/SingleTab',
  component: SingleTab,
};

export default meta;
type Story = StoryObj<typeof SingleTab>;

export const Selected: Story = {
  args: {
    icon: <TimeTravelIcon color={colors.white} />,
    title: 'Time Travel',
    isSelected: true,
    onClickHandler: () => {},
  },
};

export const Unselected: Story = {
  args: {
    icon: <TimeTravelIcon color={colors.coreText} />,
    title: 'Time Travel',
    isSelected: false,
    onClickHandler: () => {},
  },
};
