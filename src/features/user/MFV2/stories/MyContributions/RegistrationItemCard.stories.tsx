import type { Meta, StoryObj } from '@storybook/react';
import RegistrationItemCard from '../../MyContributions/RegistrationItemCard';
import {
  MyContributionsSingleRegistration,
  MyForestProject,
} from '../../../../common/types/myForestv2';

const meta: Meta<typeof RegistrationItemCard> = {
  component: RegistrationItemCard,
  title: 'Components/MyContributions/RegistrationItemCard',
};

export default meta;

type Story = StoryObj<typeof RegistrationItemCard>;

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

const sampleRegistrationDetails: MyContributionsSingleRegistration = {
  type: 'registration',
  contributionCount: 1,
  contributionUnitType: 'tree',
  totalContributionUnits: 1,
  country: 'MX',
  projectGuid: null,
  contributions: [
    {
      dataType: 'treeRegistration',
      quantity: 1,
      plantDate: '2015-09-11T00:00:00.000Z',
      unitType: 'tree',
    },
  ],
};

export const WithCountry: Story = {
  args: {
    contributionDetails: sampleRegistrationDetails,
  },
};

export const WithoutCountry: Story = {
  args: {
    contributionDetails: { ...sampleRegistrationDetails, country: null },
  },
};

export const WithProject: Story = {
  args: {
    project: sampleProject,
    contributionDetails: {
      ...sampleRegistrationDetails,
      projectGuid: sampleProject.guid,
    },
  },
};
