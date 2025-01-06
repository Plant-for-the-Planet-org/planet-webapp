import type { Meta, StoryObj } from '@storybook/react';

import UploadWidget from '../components/UploadWidget';

const meta: Meta<typeof UploadWidget> = {
  title: 'Components/UploadWidget',
  component: UploadWidget,
};

export default meta;

type Story = StoryObj<typeof UploadWidget>;

export const Empty: Story = {
  args: {
    status: 'empty',
  },
};

export const Processing: Story = {
  args: {
    status: 'processing',
  },
};

export const Success: Story = {
  args: {
    status: 'success',
  },
};

export const SuccessExtraColumns: Story = {
  args: {
    status: 'success',
    hasIgnoredColumns: true,
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    parseError: {
      type: 'noRecipientData',
      message: 'No recipient data found',
    },
  },
};
