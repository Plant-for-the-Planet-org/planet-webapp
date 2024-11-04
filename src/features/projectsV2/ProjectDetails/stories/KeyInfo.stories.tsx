import type { Meta, StoryObj } from '@storybook/react';
import KeyInfo from '../components/KeyInfo';
import type { AllowedSeasonMonths } from '@planet-sdk/common';

const meta: Meta<typeof KeyInfo> = {
  title: 'Projects/Details/KeyInfo',
  component: KeyInfo,
};

export default meta;
type Story = StoryObj<typeof KeyInfo>;

const seasons: AllowedSeasonMonths[] = [6, 7, 8, 9, 10, 11, 12, 3, 4];

export const Preview: Story = {
  args: {
    abandonment: 2005,
    firstTreePlanted: '2015-03-08 00:00:00',
    startingProtectionYear: null,
    plantingDensity: 500,
    maxPlantingDensity: 10000,
    employees: 500,
    plantingSeasons: seasons,
    activitySeasons: null,
    degradationYear: 2018,
  },
};
