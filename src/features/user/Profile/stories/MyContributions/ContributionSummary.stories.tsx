import type { Meta, StoryObj } from '@storybook/react';
import ContributionSummary from '../../MyContributions/ContributionSummary';

const meta: Meta<typeof ContributionSummary> = {
  component: ContributionSummary,
  title: 'Components/MyContributions/ContributionSummary',
};

export default meta;

type Story = StoryObj<typeof ContributionSummary>;

const donationContribution = {
  dataType: 'donation',
  quantity: 2,
  plantDate: '2020-02-11T00:00:00.000Z',
  unitType: 'tree',
  isGifted: false,
  giftDetails: null,
} as const;

const giftContribution = {
  dataType: 'receivedGift',
  quantity: 1,
  plantDate: '2020-02-11T00:00:00.000Z',
  unitType: 'tree',
  isGift: true,
  giftDetails: {
    giverName: 'Jane Doe',
  },
} as const;

export const TreeDonation: Story = {
  args: {
    contribution: donationContribution,
    purpose: 'trees',
  },
};

export const ConservedAreaDonation: Story = {
  args: {
    contribution: {
      ...donationContribution,
      unitType: 'm2',
    },
    purpose: 'conservation',
  },
};

export const RestoredAreaDonation: Story = {
  args: {
    contribution: {
      ...donationContribution,
      unitType: 'm2',
    },
    purpose: 'trees',
  },
};

export const GiftedTree: Story = {
  args: {
    contribution: {
      ...donationContribution,
      isGifted: true,
      giftDetails: {
        recipient: 'John Doe',
        type: 'null',
      },
    },
  },
};

export const ReceivedGiftedTree: Story = {
  args: {
    contribution: giftContribution,
  },
};
