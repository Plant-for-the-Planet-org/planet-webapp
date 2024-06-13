import { Meta, StoryObj } from '@storybook/react';
import ProjectSummary from '../../MyContributions/ProjectSummary';

const meta: Meta<typeof ProjectSummary> = {
  component: ProjectSummary,
  title: 'Components/MyContributions/ProjectSummary',
  argTypes: {
    projectPurpose: {
      options: ['conservation', 'trees'],
      control: {
        type: 'select',
      },
      description: 'The purpose of the project',
      table: {
        type: {
          summary: '"conservation" | "trees"',
          detail:
            'Note: `projectClassification` required if `projectPurpose = trees`. `projectEcosystem` required if `projectPurpose = conservation`',
        },
      },
    },
    projectEcosystem: {
      if: { arg: 'projectPurpose', eq: 'conservation' },
      description: 'Required if `projectPurpose = conservation`',
    },
    projectClassification: {
      if: { arg: 'projectPurpose', eq: 'trees' },
      description: 'Required if `projectPurpose = trees`',
    },
  },
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
    projectClassification: 'managed-regeneration',
    projectName: 'Trees Project',
    projectCountry: 'US',
    projectTpoName: 'TPO Name',
  },
};
