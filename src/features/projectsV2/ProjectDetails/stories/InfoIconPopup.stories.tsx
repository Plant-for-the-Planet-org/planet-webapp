import type { Meta, StoryObj } from '@storybook/react';
import InfoIconPopup from '../components/microComponents/InfoIconPopup';

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
    color: '#BDBDBD',
    children: (
      <>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio,
        repellendus!
      </>
    ),
  },
};
