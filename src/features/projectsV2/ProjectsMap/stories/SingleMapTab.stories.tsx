import type { Meta, StoryObj } from '@storybook/react';

import SatelliteIcon from '../../../../../public/assets/images/icons/SatelliteIcon';
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
    icon: <SatelliteIcon color={colors.white} />,
    title: 'Time Travel',
    isSelected: true,
    onClickHandler: () => {},
  },
};

export const Unselected: Story = {
  args: {
    icon: <SatelliteIcon color={colors.coreText} />,
    title: 'Time Travel',
    isSelected: false,
    onClickHandler: () => {},
  },
};
