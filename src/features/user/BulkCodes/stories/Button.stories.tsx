import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@mui/material';
// As this is a MUI component, there is no corresponding Button.tsx component file

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Continue',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
  },
};
