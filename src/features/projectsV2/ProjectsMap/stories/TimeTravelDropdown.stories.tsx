import TimeTravelDropdown from '../../TimeTravelDropdown';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TimeTravelDropdown> = {
  title: 'Projects/Details/TimeTravelDropdown',
  component: TimeTravelDropdown,
  argTypes: {
    onYearChange: { action: 'year changed' },
    onSourceChange: { action: 'source changed' },
  },
};

export default meta;
type Story = StoryObj<typeof TimeTravelDropdown>;

const availableYears = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];

export const Open: Story = {
  args: {
    defaultYear: '2018',
    defaultSource: 'esri',
    availableYears,
    availableSources: ['esri'],
    isOpen: true,
  },
};

export const Close: Story = {
  args: {
    defaultYear: '2021',
    defaultSource: 'esri',
    availableYears,
    availableSources: ['esri'],
    isOpen: false,
  },
};
