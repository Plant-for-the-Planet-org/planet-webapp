import type { Meta, StoryObj } from '@storybook/nextjs';
import ListHeader from '../../MyContributions/ListHeader';

const meta: Meta<typeof ListHeader> = {
  component: ListHeader,
  title: 'Components/MyContributions/ListHeader',
};

export default meta;

type Story = StoryObj<typeof ListHeader>;

export const PrivateProfileHeader: Story = {
  args: {
    profilePageType: 'private',
  },
};

export const PublicProfileHeader: Story = {
  args: {
    profilePageType: 'public',
    displayName: 'Sam',
  },
};
