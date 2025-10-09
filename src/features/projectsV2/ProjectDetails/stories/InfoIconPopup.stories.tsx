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
        This tooltip provides additional information about the item it is
        associated with. It can be used to explain complex concepts, provide
        context, or offer guidance to users. Tooltips are typically displayed
        when a user hovers over or clicks on an icon or text element.
      </>
    ),
  },
};
