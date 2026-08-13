import type { Meta, StoryObj } from '@storybook/react';
import type { MapOptions } from '../../../common/types/map';
import type { ProjectTabs } from '..';

import { useEffect, useState } from 'react';
import ProjectListControlForMobile from '../ProjectListControlForMobile';
import { useProjectStore, useViewStore } from '../../../../stores';
import { mockProjects } from './mockProjects';

const mapOptions: MapOptions = {};

const meta: Meta<typeof ProjectListControlForMobile> = {
  title: 'Projects/Landing/ProjectListControlForMobile',
  component: ProjectListControlForMobile,
  argTypes: {
    tabSelected: {
      control: 'radio',
      options: ['topProjects', 'allProjects'],
    },
  },
  decorators: [
    (Story) => {
      // Filters/projects and view mode now live in stores rather than props.
      // Seed them synchronously (before the component subscribes) and reset on
      // unmount so state doesn't leak into other stories.
      useState(() => {
        useProjectStore.setState({
          projects: mockProjects,
          topProjects: mockProjects,
          selectedClassification: [],
          showDonatableProjects: false,
          isSearching: false,
          debouncedSearchValue: '',
        });
        useViewStore.setState({ selectedMode: 'map' });
        return null;
      });
      useEffect(
        () => () => {
          useProjectStore.getState().clearFilterStates();
          useProjectStore.setState({ projects: null, topProjects: null });
          useViewStore.setState({ selectedMode: 'list' });
        },
        []
      );
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectListControlForMobile>;

export const Default: Story = {
  args: {
    tabSelected: 'topProjects',
    isMobile: true,
    shouldHideProjectTabs: false,
    mapOptions,
    updateMapOption: () => undefined,
  },
  render: (args) => {
    const [tabSelected, setTabSelected] = useState<ProjectTabs>(
      args.tabSelected ?? 'topProjects'
    );

    return (
      <ProjectListControlForMobile
        {...args}
        tabSelected={tabSelected}
        setTabSelected={setTabSelected}
      />
    );
  },
};
