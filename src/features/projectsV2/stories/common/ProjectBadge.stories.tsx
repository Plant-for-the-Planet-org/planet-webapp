import type { Meta, StoryObj } from '@storybook/react';
import ProjectBadge from '../../components/microComponents/ProjectBadge';

const meta: Meta<typeof ProjectBadge> = {
  title: 'Projects/Common/ProjectBadge',
  component: ProjectBadge,
};

export default meta;
type Story = StoryObj<typeof ProjectBadge>;

export const NonDonatable: Story = {
  args: {
    isTopProject: true,
    isApproved: true,
    allowDonations: false,
  },
};

export const TopProjects: Story = {
  args: {
    isTopProject: true,
    isApproved: true,
    allowDonations: true,
  },
};

export const FieldReviewed: Story = {
  args: {
    isTopProject: false,
    isApproved: true,
    allowDonations: true,
  },
};

export const OffSiteReviewed: Story = {
  args: {
    isTopProject: false,
    isApproved: false,
    allowDonations: true,
  },
};
