import type { Meta, StoryObj } from '@storybook/react';
import RegistrationSummary from '../../MyContributions/RegistrationSummary';

const meta: Meta<typeof RegistrationSummary> = {
  component: RegistrationSummary,
  title: 'Components/MyContributions/RegistrationSummary',
};

export default meta;

type Story = StoryObj<typeof RegistrationSummary>;

export const Default: Story = {
  args: {
    treeCount: 5,
    country: 'DE',
    registrationDate: '2020-02-11T00:00:00.000Z',
  },
};
