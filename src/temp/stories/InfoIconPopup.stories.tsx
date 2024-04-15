import type { Meta, StoryObj } from '@storybook/react';
import InfoIconPopup from '../components/InfoIconPopup';

const meta: Meta<typeof InfoIconPopup> = {
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
