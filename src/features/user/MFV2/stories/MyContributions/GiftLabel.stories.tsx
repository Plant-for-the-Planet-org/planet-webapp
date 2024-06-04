import type { Meta, StoryObj } from '@storybook/react';
import GiftLabel from '../../MyContributions/GiftLabel';

const meta: Meta<typeof GiftLabel> = {
  component: GiftLabel,
  title: 'Components/MyContributions/GiftLabel',
};

export default meta;

type Story = StoryObj<typeof GiftLabel>;

export const GiftReceived: Story = {
  args: {
    giftDetails: {
      recipient: 'John Doe',
      type: 'InvitationGift',
    },
  },
};

export const GiftGiven: Story = {
  args: {
    giftDetails: { giverName: 'Jane Doe' },
  },
};
