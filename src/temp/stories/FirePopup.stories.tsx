import type { Meta, StoryObj } from '@storybook/react';
import Popup from '../FirePopup/Popup';

const meta: Meta<typeof Popup> = {
  component: Popup,
};

export default meta;
type Story = StoryObj<typeof Popup>;

export const Open: Story = {
  args: {
    isOpen: true,
  },
};

export const Close: Story = {
  args: {
    isOpen: false,
  },
};

// import type { Meta, StoryObj } from '@storybook/react';
// import Firepopup from '../FirePopup/Firepopup';

// const meta: Meta<typeof Firepopup> = {
//   component: Firepopup,
// };

// export default meta;
// type Story = StoryObj<typeof Firepopup>;

// export const Preview: Story = {
//   args: {
//     isOpen: true, //initially selected option
//   },
// };
