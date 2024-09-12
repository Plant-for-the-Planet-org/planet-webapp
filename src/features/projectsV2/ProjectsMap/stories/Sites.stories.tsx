import type { Meta, StoryObj } from '@storybook/react';
import ProjectSiteDropdown from '../ProjectSiteDropDown';
import { Feature, Polygon } from 'geojson';
import { SiteProperties } from '../ProjectSiteDropDown';

const meta: Meta<typeof ProjectSiteDropdown> = {
  title: 'Projects/Details/ProjectSiteDropdown',
  component: ProjectSiteDropdown,
};

export default meta;
type Story = StoryObj<typeof ProjectSiteDropdown>;

const options: Feature<Polygon, SiteProperties>[] = [
  {
    geometry: {
      coordinates: [
        [
          [4.535788412887456, 50.94816094782527],
          [4.537612315018265, 50.94717406256507],
          [4.538899775345158, 50.94845836119242],
          [4.537333365279977, 50.94917484921692],
          [4.535788412887456, 50.94816094782527],
        ],
      ],
      type: 'Polygon',
    },
    type: 'Feature',
    properties: {
      lastUpdated: {
        date: '2021-04-21 13:36:31.000000',
        timezone: 'UTC',
        timezone_type: 3,
      },
      name: 'Hellebos-Rotbos-Hellebos-Rotbos-Hellebos-Rotbos-Hellebos-Rotbos-Hellebos-Rotbos',
      description: null,
      id: 'site_0YTfpF4cYb6nQTD',
      status: 'planting',
    },
  },
];

export const Preview: Story = {
  args: {
    projectSites: options,
    selectedSite: 0,
    setSelectedSite: (index) => window.alert(`Selected site index: ${index}`),
  },
};
