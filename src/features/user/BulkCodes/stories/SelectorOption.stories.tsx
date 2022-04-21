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
  method: 'generic',
  title: 'Import Codes',
  subtitle: 'Use this method if the following criterias match your usecase:',
  details: [
    'All codes will have the same value',
    'I want to generate a number of code for arbitrary recipients',
    'Names and Emails cannot be associated with the code',
  ],
  isSelected: true,
};
