import type { Meta, StoryObj } from '@storybook/react';
import ProfileActions from '../ProfileCard/ProfileActions';

const meta: Meta<typeof ProfileActions> = {
  component: ProfileActions,
  title: 'Components/ProfileActions',
};

export default meta;
type Story = StoryObj<typeof ProfileActions>;

const dummyPrivateProfile = {
  slug: 'plant-for-the-planet',
  type: 'tpo',
  currency: 'EUR',
  name: 'Plant-for-the-Planet',
  firstname: 'Felix',
  lastname: 'Finkbeiner',
  country: 'MX',
  email: 'info@plant-for-the-planet.org',
  image: '6631ed0b6be43717076254.png',
  url: null,
  urlText: null,
  displayName: 'Plant-for-the-Planet',
  supportPin: '4ab3',
  created: '2018-07-08T08:16:03+00:00',
  score: {
    personal: 10235449.86,
    received: 419,
    target: 100000000,
  },
  supportedProfile: null,
  id: 'tpo_gEZeQNxNhxZZ54zvYzCofsCr',
  isPrivate: false,
  getNews: true,
  bio: null,
  address: {
    address: '24658 Constitución',
    city: 'Campeche',
    zipCode: '82449',
    country: 'MX',
  },
  locale: 'en',
  hasLogoLicense: false,
  tin: null,
  payoutMinAmount: null,
  scheduleFrequency: 'manual',
  planetCash: {
    account: 'pcash_bXzDY0nsWb9FRqKeUSr07a4b',
    country: 'DE',
    currency: 'EUR',
    balance: 0,
    creditLimit: 0,
    giftFunds: [],
  },
};

const dummyPublicProfile = {
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

export const Private: Story = {
  args: {
    userProfile: dummyPrivateProfile,
    profileType: 'private',
  },
};

export const Public: Story = {
  args: {
    userProfile: dummyPublicProfile,
    profileType: 'public',
  },
};