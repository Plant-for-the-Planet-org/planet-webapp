import type { Meta, StoryObj } from '@storybook/nextjs';
import type { ComponentProps } from 'react';
import type { FireFeature } from '../../../common/types/fireLocation';

import { useState } from 'react';
import Popup from '.';

// Relative to now, so the "hours ago" text stays the same in every snapshot.
const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();

const fireFeature: FireFeature = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-89.65, 20.97],
  },
  properties: {
    id: 'fire-1',
    eventDate: fiveHoursAgo,
    type: 'fire',
    detectedBy: 'MODIS',
    confidence: 'high',
    distance: 0,
  },
};

// The popup needs a real element to attach to, so the story renders one.
const PopupWithAnchor = (args: ComponentProps<typeof Popup>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <div style={{ paddingTop: 220, paddingLeft: 160 }}>
      <span ref={setAnchorEl}>🔥</span>
      {anchorEl && <Popup {...args} anchorEl={anchorEl} />}
    </div>
  );
};

const meta = {
  title: 'Projects/Details/Popup',
  component: Popup,
  args: {
    feature: fireFeature,
    anchorEl: null,
  },
  render: (args) => <PopupWithAnchor {...args} />,
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
  },
};

export const Close: Story = {
  args: {
    isOpen: false,
  },
};
