import type { Meta, StoryObj } from '@storybook/react';
import VideoPlayer from '../components/VideoPlayer';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Projects/Details/VideoPlayer',
  component: VideoPlayer,
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

export const Preview: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=YG1558vDIns',
  },
};
