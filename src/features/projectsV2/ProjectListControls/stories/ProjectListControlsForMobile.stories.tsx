import ProjectListControlForMobile from '../ProjectListControlForMobile';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta<typeof ProjectListControlForMobile> = {
  title: 'Projects/Landing/ProjectListControlForMobile',
  component: ProjectListControlForMobile,
  argTypes: {
    tabSelected: {
      control: 'radio',
      options: ['topProjects', 'allProjects'],
    },
    selectedClassification: {
      control: 'multi-select',
      options: [
        'large-scale-planting',
        'agroforestry',
        'natural-regeneration',
        'managed-regeneration',
        'urban-planting',
        'other-planting',
      ],
    },
    selectedMode: {
      control: 'radio',
      options: ['list', 'map'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectListControlForMobile>;

export const Default: Story = {
  args: {
    projectCount: 20,
    topProjectCount: 30,
    setTabSelected: undefined,
    tabSelected: 'topProjects',
    selectedClassification: [],
    setSelectedClassification: undefined,
    setDebouncedSearchValue: undefined,
    setSelectedMode: undefined,
    selectedMode: 'map',
    isMobile: true,
  },
  render: (args) => {
    const [tabSelected, setTabSelected] = useState(args.tabSelected);
    const [selectedClassification, setSelectedClassification] = useState(
      args.selectedClassification
    );
    const [selectedMode, setSelectedMode] = useState(args.selectedMode);
    return (
      <ProjectListControlForMobile
        {...args}
        tabSelected={tabSelected}
        setTabSelected={(tab) => {
          setTabSelected(tab);
        }}
        selectedClassification={selectedClassification}
        setSelectedClassification={(classification) =>
          setSelectedClassification(classification)
        }
        selectedMode={selectedMode}
        setSelectedMode={(mode) => {
          setSelectedMode(mode);
          window.alert(mode);
        }}
      />
    );
  },
};
