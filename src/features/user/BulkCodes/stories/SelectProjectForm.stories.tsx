import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SelectProjectForm from '../components/SelectProjectForm';

export default {
  title: `Forms/SelectProjectForm`,
  component: SelectProjectForm,
} as ComponentMeta<typeof SelectProjectForm>;

const Template: ComponentStory<typeof SelectProjectForm> = (args) => (
  <SelectProjectForm {...args} />
);

export const Default = Template.bind({});
Default.args = {};
