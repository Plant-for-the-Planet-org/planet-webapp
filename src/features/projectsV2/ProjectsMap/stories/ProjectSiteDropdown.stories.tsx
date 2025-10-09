import type { Meta, StoryObj } from '@storybook/react';
import type { Feature, Polygon } from 'geojson';
import type { SiteProperties } from '../ProjectSiteDropDown';
import type { Intervention, SampleTreeRegistration } from '@planet-sdk/common';

import { useState } from 'react';
import ProjectSiteDropdown from '../ProjectSiteDropDown';

const meta: Meta<typeof ProjectSiteDropdown> = {
  title: 'Projects/Details/ProjectSiteDropdown',
  component: ProjectSiteDropdown,
};

export default meta;
type Story = StoryObj<typeof ProjectSiteDropdown>;

// cspell:disable
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
  {
    geometry: {
      coordinates: [
        [
          [34.953337, 0.412687],
          [34.953162, 0.412962],
          [34.95253, 0.412315],
          [34.952537, 0.412091],
          [34.953337, 0.412687],
        ],
      ],
      type: 'Polygon',
    },
    type: 'Feature',
    properties: {
      lastUpdated: {
        date: '2021-05-19 11:11:44.000000',
        timezone: 'UTC',
        timezone_type: 3,
      },
      name: 'Kahune site 2021',
      description:
        'Kadhune Friends of Earth Environment Preservation and Care is a nonprofit and registered organization. All members, youth and children are committed in environmental conservation. The core value of the organization is voluntarism that has made us go thousands miles. It has partnered with 56 community groups in Western Kenya in the billion tree campaign. It is to plant more trees to fight climate and make people live in a world free of poverty. Kadhune Friends of Earth Environment Preservation and Care is not tax deductible and ca not issue donation receipts!',
      id: 'site_NfHXbHi3wrDcK0v',
      status: 'planting',
    },
  },
  {
    geometry: {
      coordinates: [
        [
          [34.96192, -0.403153],
          [34.962245, -0.402936],
          [34.962699, -0.403746],
          [34.962201, -0.404054],
          [34.962045, -0.403656],
          [34.96189, -0.403703],
          [34.96192, -0.403153],
        ],
      ],
      type: 'Polygon',
    },
    type: 'Feature',
    properties: {
      lastUpdated: {
        date: '2021-02-21 11:09:51.000000',
        timezone: 'UTC',
        timezone_type: 3,
      },
      name: 'Kadhune Friends of Earth Environment Preservation and Care',
      description:
        'Kadhune Friends of Earth Environment Preservation and Care is a nonprofit and registered organization. All members, youth and children are committed in environmental conservation. The core value of the organization is voluntarism that has made us go thousands miles. It has partnered with 56 community groups in Western Kenya in the billion tree campaign. It is to plant more trees to fight climate and make people live in a world free of poverty.\r\n\r\nKadhune Friends of Earth Environment Preservation and Care is not tax deductible and ca not issue donation receipts!',
      id: 'site_8p5HtgIbM6A6hp8',
      status: 'planting',
    },
  },
  {
    geometry: {
      coordinates: [
        [
          [34.96324949984398, -0.4022669388359401, 1534.548414399066],
          [34.96276339370803, -0.4026885632220763, 1535.052896729498],
          [34.96304221601438, -0.40290209704409, 1530.92688280249],
          [34.96345154502158, -0.402460019897205, 1531.13601254291],
          [34.96324949984398, -0.4022669388359401, 1534.548414399066],
        ],
      ],
      type: 'Polygon',
    },
    type: 'Feature',
    properties: {
      lastUpdated: {
        date: '2021-08-02 10:36:38.000000',
        timezone: 'UTC',
        timezone_type: 3,
      },
      name: 'Kadhune Friends of Earth Environment Preservation and Care',
      description:
        'Kadhune Friends of Earth Environment Preservation and Care is a nonprofit and registered organization. All members, youth and children are committed in environmental conservation. The core value of the organization is voluntarism that has made us go thousands miles. It has partnered with 56 community groups in Western Kenya in the billion tree campaign. It is to plant more trees to fight climate and make people live in a world free of poverty. Kadhune Friends of Earth Environment Preservation and Care is not tax deductible and ca not issue donation receipts!',
      id: 'site_sGVwUU1odZ1s00M',
      status: 'planting',
    },
  },
];
// cspell:enable

export const Preview: Story = {
  render: () => {
    const [selectedSite, setSelectedSite] = useState<null | number>(0);
    const [selectedIntervention, setSelectedIntervention] =
      useState<Intervention | null>(null);
    const [_selectedSampleTree, setSelectedSampleTree] =
      useState<SampleTreeRegistration | null>(null);

    return (
      <ProjectSiteDropdown
        projectSites={options}
        selectedSite={selectedSite}
        setSelectedSite={(index) => {
          setSelectedSite(index);
        }}
        selectedIntervention={selectedIntervention}
        setSelectedIntervention={setSelectedIntervention}
        setSelectedSampleTree={setSelectedSampleTree}
      />
    );
  },
};
