import type { Meta, StoryObj } from '@storybook/react';
import AdditionalInfo from '../components/AdditionalInfo';
import type { InterventionTypes, LandOwnershipTypes } from '@planet-sdk/common';

const meta: Meta<typeof AdditionalInfo> = {
  title: 'Projects/Details/AdditionalInfo',
  component: AdditionalInfo,
};

export default meta;
type Story = StoryObj<typeof AdditionalInfo>;

const ownershipArray: LandOwnershipTypes[] = [
  'public-property',
  'private',
  'communal-land',
];

const InterventionArray: InterventionTypes[] = [
  'assisting-seed-rain',
  'control-remove-livestock',
];

export const Preview: Story = {
  args: {
    mainChallenge:
      'Overpopulation and poverty/poor living standards among the locals has led to increased pressure on demand for natural resources in Mida creek.',
    siteOwnerName: 'Plant-for-the-Planet Foundation',
    causeOfDegradation:
      'The escalating poor living standards/poverty of the locals, has led to increased pressure on natural resources and left with no any other alternative other than what they can get from the mangrove forest.',
    whyThisSite:
      'Mida Creek is a stopover of many migratory birds and a foraging heaven for green turtles. Mida Creek is a UNESCO Biosphere Reserve that promote conservation of biodiversity hence that need to increase the forest cover through restoration of the degraded sites.',
    longTermPlan:
      'We anticipate that through the donations from here, the group shall be able to start more ecotourism ventures at different spots around Mida Creek to eleviate poverty and reduce the pressure on mangrove resources as we move along to meet our 2 million tree target.',
    siteOwnershipType: ownershipArray,
    acquiredSince: 2015,
    mainInterventions: InterventionArray,
    actions: null,
    socialBenefits: null,
    ecologicalBenefits: null,
    coBenefits: null,
    ownershipTenure: 'rent',
  },
};
