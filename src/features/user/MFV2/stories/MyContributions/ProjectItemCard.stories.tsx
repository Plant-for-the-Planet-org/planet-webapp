import type { Meta, StoryObj } from '@storybook/react';
import ProjectItemCard from '../../MyContributions/ProjectItemCard';
import { MyForestProject } from '../../../../common/types/myForestv2';
import { MyContributionsSingleProject } from '../../../../common/types/myForestv2';

const meta: Meta<typeof ProjectItemCard> = {
  component: ProjectItemCard,
  title: 'Components/MyContributions/ProjectItemCard',
};

export default meta;

type Story = StoryObj<typeof ProjectItemCard>;

const sampleProject: MyForestProject = {
  guid: 'proj_WZkyugryh35sMmZMmXCwq7YY',
  name: 'Yucatán Restoration',
  slug: 'yucatan',
  classification: 'large-scale-planting',
  purpose: 'trees',
  unitType: 'tree',
  country: 'MX',
  geometry: {
    type: 'Point',
    coordinates: [-90.134383, 18.785798],
  },
  image:
    'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5fc681619bcc7992543306.jpeg',
  allowDonations: true,
  tpoName: 'Plant-for-the-Planet',
  ecosystem: null,
};

const sampleContributionDetails: MyContributionsSingleProject = {
  type: 'project',
  contributionCount: 4,
  totalContributionUnits: 10.599999999999998,
  contributionUnitType: 'tree',
  latestContributions: [
    {
      dataType: 'donation',
      plantDate: '2024-05-16T07:06:54.000Z',
      quantity: 10,
      unitType: 'tree',
      isGifted: false,
      giftDetails: null,
    },
    {
      dataType: 'receivedGift',
      plantDate: '2024-01-15T07:47:14.000Z',
      quantity: 0.2,
      unitType: 'tree',
      isGift: true,
      giftDetails: {
        giverName: 'Die Gute Schokolade/Change Chocolate',
      },
    },
    {
      dataType: 'receivedGift',
      plantDate: '2024-01-15T07:46:53.000Z',
      quantity: 0.2,
      unitType: 'tree',
      isGift: true,
      giftDetails: {
        giverName: 'Die Gute Schokolade/Change Chocolate',
      },
    },
    {
      dataType: 'receivedGift',
      plantDate: '2024-01-15T07:45:37.000Z',
      quantity: 0.2,
      unitType: 'tree',
      isGift: true,
      giftDetails: {
        giverName: 'Die Gute Schokolade/Change Chocolate',
      },
    },
  ],
};

export const Multiple: Story = {
  args: {
    project: sampleProject,
    contributionDetails: sampleContributionDetails,
  },
};

export const SingleGift: Story = {
  args: {
    project: sampleProject,
    contributionDetails: {
      ...sampleContributionDetails,
      contributionCount: 1,
      totalContributionUnits: 5,
      latestContributions: [
        {
          dataType: 'receivedGift',
          plantDate: '2024-01-15T07:47:14.000Z',
          quantity: 5,
          unitType: 'tree',
          isGift: true,
          giftDetails: {
            giverName: 'Die Gute Schokolade/Change Chocolate',
          },
        },
      ],
    },
  },
};

export const SingleNonGift: Story = {
  args: {
    project: sampleProject,
    contributionDetails: {
      ...sampleContributionDetails,
      contributionCount: 1,
      totalContributionUnits: 5,
      latestContributions: [
        {
          dataType: 'donation',
          plantDate: '2024-05-16T07:06:54.000Z',
          quantity: 5,
          unitType: 'tree',
          isGifted: false,
          giftDetails: null,
        },
      ],
    },
  },
};
