import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CreationMethodForm from '../components/CreationMethodForm';

export default {
  title: `Components/CreationMethodForm`,
  component: CreationMethodForm,
} as ComponentMeta<typeof CreationMethodForm>;

const Template: ComponentStory<typeof CreationMethodForm> = (args) => (
  <CreationMethodForm {...args} />
);

export const Default = Template.bind({});
Default.args = {};
