import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import BulkGiftTotal from '../components/BulkGiftTotal';

export default {
  title: 'Components/BulkGiftTotal',
  component: BulkGiftTotal,
} as Meta<typeof BulkGiftTotal>;

const Template: StoryFn<typeof BulkGiftTotal> = (args) => (
  <BulkGiftTotal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  amount: 560,
  currency: 'USD',
  units: 500,
  unit: 'tree',
};
