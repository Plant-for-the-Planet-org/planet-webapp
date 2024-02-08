import type { Meta, StoryObj } from '@storybook/react';
import InfoContainer from '../ProjectInfo/InfoContainer';

const meta: Meta<typeof InfoContainer> = {
  component: InfoContainer,
};

export default meta;
type Story = StoryObj<typeof InfoContainer>;

const seasons = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'August',
  'September',
  'October',
  'November',
  'December',
  'July',
];

export const Preview: Story = {
  args: {
    abandonment: 2005,
    firstTree: 'July 17, 2018',
    plantingDensity: 500,
    maxPlantingDensity: 10000,
    employees: 500,
    plantingSeasons: seasons,
  },
};
