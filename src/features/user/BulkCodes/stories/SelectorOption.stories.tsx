import type { Meta, StoryObj } from '@storybook/react';

import SelectorOption from '../components/SelectorOption';
import { BulkCodeMethods } from '../../../../utils/constants/bulkCodeConstants';

const meta: Meta<typeof SelectorOption> = {
  title: 'Components/SelectorOption',
  component: SelectorOption,
};

export default meta;

type Story = StoryObj<typeof SelectorOption>;

export const Unselected: Story = {
  args: {
    method: BulkCodeMethods.GENERIC,
    title: 'Create Generic Codes',
    subtitle: 'Use this method if the following criteria match your use case:',
    details: [
      'All codes will have the same value',
      'I want to generate a number of code for arbitrary recipients',
      'Names and Emails cannot be associated with the code',
    ],
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    method: BulkCodeMethods.IMPORT,
    title: 'Import Codes',
    subtitle:
      'Use this method if one of the following criteria match your use case:',
    details: [
      "I want to provide the Recipient's name or Email for each code",
      'I want Plant-for-the-Planet to automatically email the recipients once it has been generated (optional)',
      'I want to issue codes with different units of trees',
    ],
    isSelected: true,
  },
};
