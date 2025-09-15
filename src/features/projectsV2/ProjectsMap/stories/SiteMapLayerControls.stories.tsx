import type { Meta, StoryObj } from '@storybook/react';
import SiteMapLayerControls from '../SiteMapLayerControls';
import themeProperties from '../../../../theme/themeProperties';

const meta: Meta<typeof SiteMapLayerControls> = {
  title: 'Projects/Details/SiteMapLayerControls',
  component: SiteMapLayerControls,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: themeProperties.designSystem.colors.leafGreen,
          height: '550px',
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
