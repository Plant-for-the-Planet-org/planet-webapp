import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ProjectSelector from '../components/ProjectSelector';

export default {
  title: `Components/ProjectSelector`,
  component: ProjectSelector,
} as ComponentMeta<typeof ProjectSelector>;

const Template: ComponentStory<typeof ProjectSelector> = (args) => (
  <ProjectSelector {...args} />
);

export const Default = Template.bind({});
Default.args = {};
