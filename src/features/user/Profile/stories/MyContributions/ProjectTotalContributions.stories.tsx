import type { Meta, StoryObj } from '@storybook/react';

import ProjectTotalContributions from '../../MyContributions/ProjectTotalContributions';

const meta: Meta<typeof ProjectTotalContributions> = {
  component: ProjectTotalContributions,
  title: 'Components/MyContributions/ProductTotalContributions',
  argTypes: {
    projectPurpose: {
      control: {
        type: 'select',
      },
      description: 'The purpose of the project',
      table: {
        type: {
          summary: '"conservation" | "trees"',
          detail:
            'Note: If `projectPurpose = conservation`, contribution unit type must be `m2`.',
        },
      },
    },
    contributionUnitType: {
      control: {
        type: 'radio',
        options: ['m2', 'tree'],
      },
      description: 'Can only be `m2` if `projectPurpose = conservation`',
    },
  },
};
export default meta;

type Story = StoryObj<typeof ProjectTotalContributions>;

export const ConservationProject: Story = {
  args: {
    projectPurpose: 'conservation',
    totalContributionUnits: 5,
    contributionUnitType: 'm2',
  },
};

export const TreesProjectWithUnitTypeTree: Story = {
  args: {
    projectPurpose: 'trees',
    totalContributionUnits: 5,
    contributionUnitType: 'tree',
  },
};

export const TreesProjectWithUnitTypeM2: Story = {
  args: {
    projectPurpose: 'trees',
    totalContributionUnits: 5,
    contributionUnitType: 'm2',
  },
};
