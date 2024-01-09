import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import UnitCostDisplay from '../components/UnitCostDisplay';

export default {
  title: 'Components/UnitCostDisplay',
  component: UnitCostDisplay,
} as Meta<typeof UnitCostDisplay>;

const Template: StoryFn<typeof UnitCostDisplay> = (args) => (
  <UnitCostDisplay {...args} />
);

export const Default = Template.bind({});
Default.args = {
  unitCost: 1.12,
  currency: 'USD',
  unit: 'tree',
};
