import type { Meta, StoryObj } from '@storybook/react';
import DonateButton from '../../MyContributions/DonateButton';

const meta: Meta<typeof DonateButton> = {
  component: DonateButton,
  title: 'Components/MyContributions/DonateButton',
};

export default meta;

type Story = StoryObj<typeof DonateButton>;

const unsupportedDonationSample = {
  type: 'unsupported',
  buttonText: 'Donate Again',
} as const;

const supportedDonationSample = {
  type: 'supported',
  // cspell:disable-next-line
  supportedTreecounter: 'mohit-bajaj',
  buttonText: 'Donate',
} as const;

const treeDonationSample = {
  projectPurpose: 'trees',
  contributionUnitType: 'tree',
  projectSlug: 'yucatan',
} as const;

export const UnsupportedTreeDonation: Story = {
  args: {
    ...unsupportedDonationSample,
    ...treeDonationSample,
  },
};

export const UnsupportedRestorationDonation: Story = {
  args: {
    ...unsupportedDonationSample,
    projectPurpose: 'trees',
    contributionUnitType: 'm2',
    projectSlug: 'eden-reforestation-projects-nepal',
  },
};

export const UnsupportedConservationDonation: Story = {
  args: {
    ...unsupportedDonationSample,
    projectPurpose: 'conservation',
    contributionUnitType: 'm2',
    projectSlug: 'conservation-aa-andes',
  },
};

export const SupportedTreeDonation: Story = {
  args: {
    ...supportedDonationSample,
    ...treeDonationSample,
  },
};
