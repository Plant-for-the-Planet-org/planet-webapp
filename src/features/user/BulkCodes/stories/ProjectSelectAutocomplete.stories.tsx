import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import ProjectSelectAutocomplete from '../components/ProjectSelectAutocomplete';

export default {
  title: 'Components/ProjectSelectAutocomplete',
  component: ProjectSelectAutocomplete,
} as Meta<typeof ProjectSelectAutocomplete>;

const Template: StoryFn<typeof ProjectSelectAutocomplete> = (args) => (
  <ProjectSelectAutocomplete {...args} />
);

export const Default = Template.bind({});
Default.args = {};
