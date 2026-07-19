import type { Meta, StoryObj } from '@storybook/react';

import { useEffect, useState } from 'react';
import ProjectListControls, { type ProjectTabs } from '..';
import { useProjectStore } from '../../../../stores';
import { mockProjects } from './mockProjects';

const meta: Meta<typeof ProjectListControls> = {
  title: 'Projects/Landing/ProjectListControls',
  component: ProjectListControls,
  argTypes: {
    tabSelected: {
      control: 'radio',
      options: ['topProjects', 'allProjects'],
    },
  },
  decorators: [
    (Story) => {
      // The component now reads filters/projects from the project store instead
      // of props. Seed the store synchronously (before the component subscribes)
      // and reset it on unmount so state doesn't leak into other stories.
      useState(() => {
        useProjectStore.setState({
          projects: mockProjects,
          topProjects: mockProjects,
          selectedClassification: [],
          showDonatableProjects: false,
          isSearching: false,
          debouncedSearchValue: '',
        });
        return null;
      });
      useEffect(
        () => () => {
          useProjectStore.getState().clearFilterStates();
          useProjectStore.setState({ projects: null, topProjects: null });
        },
        []
      );
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectListControls>;

export const Default: Story = {
  args: {
    tabSelected: 'topProjects',
    shouldHideProjectTabs: false,
  },
  render: (args) => {
    const [tabSelected, setTabSelected] = useState<ProjectTabs>(
      args.tabSelected ?? 'topProjects'
    );

    return (
      <ProjectListControls
        {...args}
        tabSelected={tabSelected}
        setTabSelected={setTabSelected}
      />
    );
  },
};
