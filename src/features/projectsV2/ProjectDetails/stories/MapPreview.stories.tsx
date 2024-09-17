import type { Meta, StoryObj } from '@storybook/react';
import MapPreview from '../components/MapPreview';

const meta: Meta<typeof MapPreview> = {
  title: 'Projects/Details/MapPreview',
  component: MapPreview,
};

export default meta;
type Story = StoryObj<typeof MapPreview>;

export const Preview: Story = {};
