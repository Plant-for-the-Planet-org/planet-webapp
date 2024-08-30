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
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        // Provide valid coordinates for a polygon
        [
          [-90.1423066869791, 18.6684857455352],
          [-90.1423244145065, 18.6697621275049],
          [-90.1423066869791, 18.6684857455352],
        ],
      ],
    },
    properties: {
      lastUpdated: {
        date: '',
        timezone: '',
        timezone_type: 4,
      },
      name: 'site 1',
      description: null,
      id: '2',
      status: '',
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
