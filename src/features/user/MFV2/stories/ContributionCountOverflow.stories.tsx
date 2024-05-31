import type { Meta, StoryObj } from '@storybook/react';
import ContributionCountOverflow from '../MyContributions/ContributionCountOverflow';

const meta: Meta<typeof ContributionCountOverflow> = {
  component: ContributionCountOverflow,
  title: 'Components/ContributionCountOverflow',
};

export default meta;

type Story = StoryObj<typeof ContributionCountOverflow>;

export const Default: Story = {
  args: {
    contributionCount: 5,
    displayedCount: 3,
  },
};
