import type { Meta, StoryObj } from '@storybook/react';
import ItemMobileHeader from '../../MyContributions/ItemMobileHeader';

const meta: Meta<typeof ItemMobileHeader> = {
  component: ItemMobileHeader,
  title: 'Components/MyContributions/ItemMobileHeader',
};

export default meta;

type Story = StoryObj<typeof ItemMobileHeader>;

const ProjectArgs = {
  type: 'project',
  projectName: 'Yucatan',
  projectImageUrl:
    'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5fc681619bcc7992543306.jpeg',
  projectPurpose: 'trees',
  projectClassification: 'mangroves',
} as const;

export const ProjectWithoutGift: Story = {
  args: ProjectArgs,
};

export const ProjectWithGift: Story = {
  args: {
    ...ProjectArgs,
    giftDetails: {
      giverName: 'John Doe',
    },
  },
};

export const ProjectWithoutImage: Story = {
  args: {
    ...ProjectArgs,
    projectImageUrl: undefined,
  },
};

export const Registration: Story = {
  args: {
    type: 'registration',
  },
};

export const RegistrationWithImage: Story = {
  args: {
    type: 'registration',
    projectName: 'Yucatan',
    projectImageUrl:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5fc681619bcc7992543306.jpeg',
  },
};
