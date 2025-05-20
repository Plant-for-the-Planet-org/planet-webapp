import type { Meta, StoryObj } from '@storybook/react';
import SiteMapLayerControls from '../SiteMapLayerControls';

const meta: Meta<typeof SiteMapLayerControls> = {
  title: 'Projects/Details/SiteMapLayerControls',
  component: SiteMapLayerControls,
  decorators: [
    (Story) => (
      <div
        style={{
          border: '1px solid #ccc',
          height: '400px',
          padding: '16px',
          position: 'relative',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SiteMapLayerControls>;

export const Default: Story = {};
