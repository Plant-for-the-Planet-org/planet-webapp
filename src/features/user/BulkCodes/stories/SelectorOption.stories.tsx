import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SelectorOption from '../components/SelectorOption';

export default {
  title: `Components/SelectorOptions`,
  component: SelectorOption,
} as ComponentMeta<typeof SelectorOption>;

const Template: ComponentStory<typeof SelectorOption> = (args) => (
  <SelectorOption {...args} />
);

export const Unselected = Template.bind({});
Unselected.args = {
  method: 'generic',
  title: 'Create Generic Codes',
  subtitle: 'Use this method if the following criterias match your usecase:',
  details: [
    'All codes will have the same value',
    'I want to generate a number of code for arbitrary recipients',
    'Names and Emails cannot be associated with the code',
  ],
  isSelected: false,
};

export const Selected = Template.bind({});
Selected.args = {
  method: 'import',
  title: 'Import Codes',
  subtitle:
    'Use this method if one of the following criterias match your usecase:',
  details: [
    "I want to provide the Recipient's name or Email for each code",
    'I want Plant-for-the-Planet to automatically email the recipients once it has been generated (optional)',
    'I want to issue codes with different units of trees',
  ],
  isSelected: true,
};
