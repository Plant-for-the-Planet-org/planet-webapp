import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ProjectSelectAutocomplete from '../components/ProjectSelectAutocomplete';

export default {
  title: `Components/ProjectSelectAutocomplete`,
  component: ProjectSelectAutocomplete,
} as ComponentMeta<typeof ProjectSelectAutocomplete>;

const Template: ComponentStory<typeof ProjectSelectAutocomplete> = (args) => (
  <ProjectSelectAutocomplete {...args} />
);

export const Default = Template.bind({});
Default.args = {};
