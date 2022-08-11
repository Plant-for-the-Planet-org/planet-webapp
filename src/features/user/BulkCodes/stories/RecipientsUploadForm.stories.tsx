import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import RecipientsUploadForm from '../components/RecipientsUploadForm';

export default {
  title: `Components/RecipientsUploadForm`,
  component: RecipientsUploadForm,
} as ComponentMeta<typeof RecipientsUploadForm>;

const Template: ComponentStory<typeof RecipientsUploadForm> = (args) => (
  <RecipientsUploadForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  localRecipients: [],
};
