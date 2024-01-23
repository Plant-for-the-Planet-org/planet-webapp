import type { Meta, StoryObj } from '@storybook/react';
import Tabs from '../ProjectViewTabs/Tabs';

const meta: Meta<typeof Tabs> = {
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const TabsView: Story = {
  args: {
    selected: 'satellite',
  },
};
