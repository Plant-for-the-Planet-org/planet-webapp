import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '@mui/material';
// As this is a MUI component, there is no corresponding Button.tsx component file

export default {
  title: `Components/Button`,
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'contained',
  color: 'primary',
  children: 'Continue',
};

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  variant: 'contained',
  color: 'primary',
  children: 'Continue',
  disabled: true,
};
