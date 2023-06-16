import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import RecipientsUploadForm from '../components/RecipientsUploadForm';

export default {
  title: 'Components/RecipientsUploadForm',
  component: RecipientsUploadForm,
} as Meta<typeof RecipientsUploadForm>;

const Template: StoryFn<typeof RecipientsUploadForm> = (args) => (
  <RecipientsUploadForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  localRecipients: [],
};
