import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BulkGiftTotal from '../components/BulkGiftTotal';

export default {
  title: `Components/BulkGiftTotal`,
  component: BulkGiftTotal,
} as ComponentMeta<typeof BulkGiftTotal>;

const Template: ComponentStory<typeof BulkGiftTotal> = (args) => (
  <BulkGiftTotal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  amount: 560,
  currency: 'USD',
  units: 500,
  unit: 'tree',
};
