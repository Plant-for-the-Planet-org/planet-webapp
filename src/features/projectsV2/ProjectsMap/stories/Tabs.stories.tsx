import type { Meta, StoryObj } from '@storybook/react';
import Tabs from '../ProjectMapTabs';

const meta: Meta<typeof Tabs> = {
  title: 'Projects/Details/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const TabsView: Story = {
  args: {
    selectedTab: 'field', //initially selected option
  },
};
