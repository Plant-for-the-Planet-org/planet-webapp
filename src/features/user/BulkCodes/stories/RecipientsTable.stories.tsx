import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import RecipientsTable from '../components/RecipientsTable';

export default {
  title: `Components/RecipientsTable`,
  component: RecipientsTable,
} as ComponentMeta<typeof RecipientsTable>;

const Template: ComponentStory<typeof RecipientsTable> = (args) => (
  <RecipientsTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  headers: [
    'recipient_name',
    'recipient_email',
    'recipient_notify',
    'units',
    'recipient_message',
    /*'recipient_occasion',*/
  ],
  recipients: [
    {
      recipient_name: 'Robert Lewandowski',
      recipient_email: 'robert@example.com',
      recipient_notify: 'yes',
      recipient_message: 'Great work!',
      /*recipient_occasion: '30 Goals',*/
      units: '10',
    },
    {
      recipient_name: 'Thomas Müller',
      recipient_email: 'thomas@example.com',
      recipient_notify: 'yes',
      recipient_message: 'Awesomesauce',
      /*recipient_occasion: '10 Goals',*/
      units: '20',
    },
    {
      recipient_name: 'Alphonso Davies',
      recipient_email: 'alphonso@example.com',
      recipient_notify: 'no',
      recipient_message: '',
      /*recipient_occasion: '10 Assists',*/
      units: '21',
    },
    {
      recipient_name: 'Leroy Sanè',
      recipient_email: 'leroy@example.com',
      recipient_notify: 'yes',
      recipient_message: 'Fantastic!!',
      /*recipient_occasion: '20 Assists',*/
      units: '5',
    },
  ],
};
