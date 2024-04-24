import TimeTravelDropdown from '../TimeTravelDropdown';
import sources from '../../../public/data/maps/sources.json';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TimeTravelDropdown> = {
  component: TimeTravelDropdown,
};

export default meta;
type Story = StoryObj<typeof TimeTravelDropdown>;

const yearList = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];

export const Open: Story = {
  args: {
    labelYear: '2018',
    labelSource: 'Esri',
    yearList: yearList,
    sourceList: Object.values(sources),
    isOpen: true,
  },
};

export const Close: Story = {
  args: {
    labelYear: '2018',
    labelSource: 'Esri',
    yearList: yearList,
    sourceList: Object.values(sources),
    isOpen: false,
  },
};
