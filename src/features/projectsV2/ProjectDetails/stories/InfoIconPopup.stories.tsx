import type { Meta, StoryObj } from '@storybook/react';
import InfoIconPopup from '../components/microComponents/InfoIconPopup';
import themeProperties from '../../../../theme/themeProperties';

const meta: Meta<typeof InfoIconPopup> = {
  title: 'Projects/Common/InfoIconPopup',
  component: InfoIconPopup,
};

export default meta;
type Story = StoryObj<typeof InfoIconPopup>;

export const TabsView: Story = {
  args: {
    height: 15,
    width: 15,
    color: themeProperties.designSystem.colors.mediumGrey,
    children: (
      <>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio,
        repellendus!
      </>
    ),
  },
};
