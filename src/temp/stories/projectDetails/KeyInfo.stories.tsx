import type { Meta, StoryObj } from '@storybook/react';
import KeyInfo from '../../ProjectInfo/KeyInfo';

const meta: Meta<typeof KeyInfo> = {
  title: 'Project Details/KeyInfo',
  component: KeyInfo,
};

export default meta;
type Story = StoryObj<typeof KeyInfo>;

const seasons = [6, 7, 8, 9, 10, 11, 12, 3, 4];

export const Preview: Story = {
  args: {
    abandonment: 2005,
    firstTree: '2015-03-08 00:00:00',
    plantingDensity: 500,
    maxPlantingDensity: 10000,
    employees: 500,
    plantingSeasons: seasons,
  },
};
