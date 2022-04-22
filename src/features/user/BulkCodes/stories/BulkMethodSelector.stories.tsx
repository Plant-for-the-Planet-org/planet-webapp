import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BulkMethodSelector from '../components/BulkMethodSelector';

export default {
  title: `Components/BulkMethodSelector`,
  component: BulkMethodSelector,
} as ComponentMeta<typeof BulkMethodSelector>;

const Template: ComponentStory<typeof BulkMethodSelector> = (args) => (
  <BulkMethodSelector {...args} />
);

export const Default = Template.bind({});
Default.args = {};
