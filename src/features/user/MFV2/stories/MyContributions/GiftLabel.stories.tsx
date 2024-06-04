import type { Meta, StoryObj } from '@storybook/react';
import GiftLabel from '../../MyContributions/GiftLabel';

const meta: Meta<typeof GiftLabel> = {
  component: GiftLabel,
  title: 'Components/MyContributions/GiftLabel',
  argTypes: {
    giftGiver: {
      if: { arg: 'giftDirection', eq: 'received' },
    },
    giftReceiver: {
      if: { arg: 'giftDirection', eq: 'given' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GiftLabel>;

export const GiftReceived: Story = {
  args: {
    giftDirection: 'received',
    giftGiver: 'Jane Doe',
  },
};

export const GiftGiven: Story = {
  args: {
    giftDirection: 'given',
    giftReceiver: 'Jane Doe',
  },
};
