import type { Meta, StoryObj } from '@storybook/react';
import SiteMapLayerControls from '../SiteMapLayerControls';

const meta: Meta<typeof SiteMapLayerControls> = {
  title: 'Projects/Details/SiteMapLayerControls',
  component: SiteMapLayerControls,
};

export default meta;
type Story = StoryObj<typeof SiteMapLayerControls>;

export const Default: Story = {};
