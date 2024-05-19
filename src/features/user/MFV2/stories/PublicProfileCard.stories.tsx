import type { Meta, StoryObj } from '@storybook/react';
import ProfileCard from '../ProfileCard';

const meta: Meta<typeof ProfileCard> = {
  component: ProfileCard,
  title: 'Components/PublicProfileCard',
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

const dummyUserProfile = {
  slug: 'prachi-garg',
  type: 'individual',
  image: '663bb3840f303535831427.jpg',
  url: 'https://dev.pp.eco/en',
  urlText: null,
  displayName: 'Prachi Garggggggg',
  created: '2022-06-24T08:29:00+00:00',
  score: {
    personal: 8.0,
    received: 0.0,
    target: 0.0,
  },
  supportedProfile: null,
  id: 'prf_n06cLhehvsBEpbyiVDorLP6f',
  bio: 'planting trees',
  hasLogoLicense: false,
};

export const Preview: Story = {
  args: {
    userProfile: dummyUserProfile,
    profileType: 'public',
  },
};
