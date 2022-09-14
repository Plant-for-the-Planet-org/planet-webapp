import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import UnitCostDisplay from '../components/UnitCostDisplay';

export default {
  title: `Components/UnitCostDisplay`,
  component: UnitCostDisplay,
} as ComponentMeta<typeof UnitCostDisplay>;

const Template: ComponentStory<typeof UnitCostDisplay> = (args) => (
  <UnitCostDisplay {...args} />
);

export const Default = Template.bind({});
Default.args = {
  unitCost: 1.12,
  currency: 'USD',
  unit: 'tree',
};
