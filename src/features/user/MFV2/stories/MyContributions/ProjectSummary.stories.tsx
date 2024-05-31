import { Meta, StoryObj } from '@storybook/react';
import ProjectSummary from '../../MyContributions/ProjectSummary';

const meta: Meta<typeof ProjectSummary> = {
  component: ProjectSummary,
  title: 'Components/MyContributions/ProjectSummary',
};

export default meta;

type Story = StoryObj<typeof ProjectSummary>;

export const ConservationProject: Story = {
  args: {
    projectPurpose: 'conservation',
    projectEcosystem: 'mangroves',
    projectName: 'Conservation Project',
    projectCountry: 'US',
    projectTpoName: 'TPO Name',
  },
};

export const TreesProject: Story = {
  args: {
    projectPurpose: 'trees',
    classification: 'managed-regeneration',
    projectName: 'Trees Project',
    projectCountry: 'US',
    projectTpoName: 'TPO Name',
  },
};
