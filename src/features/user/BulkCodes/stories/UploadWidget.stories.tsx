import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import UploadWidget from '../components/UploadWidget';

export default {
  title: `Components/UploadWidget`,
  component: UploadWidget,
} as ComponentMeta<typeof UploadWidget>;

const Template: ComponentStory<typeof UploadWidget> = (args) => (
  <UploadWidget {...args} />
);

export const Empty = Template.bind({});
Empty.args = {
  status: 'empty',
};

export const Processing = Template.bind({});
Processing.args = {
  status: 'processing',
};

export const Success = Template.bind({});
Success.args = {
  status: 'success',
};

export const SuccessExtraColumns = Template.bind({});
SuccessExtraColumns.args = {
  status: 'success',
  hasIgnoredColumns: true,
};

export const Error = Template.bind({});
Error.args = {
  status: 'error',
  parseError: {
    type: 'noRecipientData',
    message: 'No recipient data found',
  },
};
