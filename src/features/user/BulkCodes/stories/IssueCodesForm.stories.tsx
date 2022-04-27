import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import IssueCodesForm from '../components/IssueCodesForm';

export default {
  title: `Forms/IssueCodesForm`,
  component: IssueCodesForm,
} as ComponentMeta<typeof IssueCodesForm>;

const Template: ComponentStory<typeof IssueCodesForm> = (args) => (
  <IssueCodesForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  project: 'Yucatan restoration',
};
