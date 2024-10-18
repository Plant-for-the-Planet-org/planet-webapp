import type { Meta, StoryObj } from '@storybook/react';
import ProjectSiteDropdown from '../ProjectSiteDropDown';
import { Feature, Polygon } from 'geojson';
import { SiteProperties } from '../ProjectSiteDropDown';
import { useState } from 'react';
import {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';

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
/* const selectedPlantLocation: PlantLocationMulti = {
  nextMeasurementDate: null,
  hid: 'ZAUYCK',
  metadata: {
    app: {
      appVersion: '1.0.8',
      deviceSystemName: 'Android',
      deviceSystemVersion: '12',
      deviceModel: 'SM-A536E',
      deviceManufacturer: 'samsung',
      deviceBrand: 'samsung',
      deviceLocation: {
        coordinates: [-90.1320438, 18.68243300000001],
        type: 'Point',
      },
    },
    public: [],
  },
  scientificName: null,
  sampleInterventions: [
    {
      nextMeasurementDate: null,
      parent: 'ivn_08FgSkuN0uLhQsTJkj1MFIJJ',
      hid: 'EKHZIK',
      metadata: {
        app: {
          appVersion: '1.0.8',
          deviceSystemName: 'Android',
          deviceSystemVersion: '12',
          deviceModel: 'SM-A536E',
          deviceManufacturer: 'samsung',
          deviceBrand: 'samsung',
          deviceLocation: {
            coordinates: [-90.1318695, 18.6824257],
            type: 'Point',
          },
        },
        private: [],
        public: [],
      },
      scientificName: 'Guazuma ulmifolia',
      sampleInterventions: [],
      description: null,
      otherSpecies: null,
      geometryUpdatesCount: 0,
      type: 'sample-tree-registration',
      interventionEndDate: '2022-08-17 00:00:00',
      plantProjectSite: null,
      statusReason: null,
      registrationDate: '2022-08-17 00:00:00',
      sampleTreeCount: null,
      id: 'sivn_cMKoJoO5e9lm8sBlYysqES3O',
      tag: '17810',
      plantDate: '2022-08-17 00:00:00',
      measurements: {
        width: 0.1,
        height: 0.4,
      },
      interventionStartDate: '2022-08-17 00:00:00',
      idempotencyKey: '2b598c99b58fc9a41b3945c933353bf9',
      profile: 'tpo_gEZeQNxNhxZZ54zvYzCofsCr',
      coordinates: [
        {
          image: '6307f34b7a152996408413.jpg',
          created: '2022-08-18 10:41:29',
          coordinateIndex: 0,
          id: 'coord_6vhswbkD5SFozbIyCCGPtPi7',
          updated: '2022-08-25 22:10:19',
          status: 'complete',
        },
      ],
      scientificSpecies: 'sspec_sB8hEN129P1OTKPQMh',
      history: [],
      plantProject: 'xyz',
      plantedSpecies: [],
      originalGeometry: {
        coordinates: [-90.1318695, 18.682425700000003],
        type: 'Point',
      },
      captureMode: 'on-site',
      geometry: {
        coordinates: [-90.1318695, 18.682425700000003],
        type: 'Point',
      },
      lastMeasurementDate: '2022-08-17 00:00:00',
      captureStatus: 'complete',
      deviceLocation: {
        coordinates: [-90.1318695, 18.6824257],
        type: 'Point',
      },
      status: null,
    },
  ],
  description: null,
  otherSpecies: null,
  geometryUpdatesCount: 0,
  type: 'multi-tree-registration',
  interventionEndDate: '2022-08-17 00:00:00',
  plantProjectSite: null,
  statusReason: null,
  registrationDate: '2022-08-17 00:00:00',
  sampleTreeCount: 10,
  id: 'ivn_08FgSkuN0uLhQsTJkj1MFIJJ',
  tag: null,
  plantDate: '2022-08-17 00:00:00',
  measurements: null,
  interventionStartDate: '2022-08-17 00:00:00',
  idempotencyKey: 'b47f0c9c9f3dbb8210eaa921031f676e',
  coordinates: [
    {
      image: '62fe159aecc95090182964.jpg',
      coordinateIndex: 3,
      id: 'coord_gqCtrzoo0fXz0KDn2urNOn29',
      status: 'complete',
    },
  ],
  scientificSpecies: null,
  history: [],
  plantProject: 'proj_WZkyugryh35sMmZMmXCwq7YY',
  plantedSpecies: [
    {
      scientificName: 'Cordia dodecandra',
      created: '2022-08-18 10:32:47',
      otherSpecies: undefined,
      scientificSpecies: 'sspec_0js3CX7f970bwh05mT',
      treeCount: 486,
      id: 'pspec_Ji94QImA2ArMRnYt5pukz4Ct',
      updated: '2022-08-18 10:32:47',
    },
  ],
  originalGeometry: {
    coordinates: [
      [
        [-90.1320438, 18.68243300000001],
        [-90.1313396, 18.6817704],
        [-90.1309136, 18.682122000000003],
        [-90.13161189999998, 18.68277789999999],
        [-90.1320438, 18.68243300000001],
      ],
    ],
    type: 'Polygon',
  },
  captureMode: 'on-site',
  geometry: {
    coordinates: [
      [
        [-90.1320438, 18.68243300000001],
        [-90.1313396, 18.6817704],
        [-90.1309136, 18.682122000000003],
        [-90.13161189999998, 18.68277789999999],
        [-90.1320438, 18.68243300000001],
      ],
    ],
    type: 'Polygon',
  },
  lastMeasurementDate: null,
  captureStatus: 'complete',
  deviceLocation: {
    coordinates: [-90.1320438, 18.68243300000001],
    type: 'Point',
  },
  status: null,
  image: null,
}; */

export const Preview: Story = {
  render: () => {
    const [selectedSite, setSelectedSite] = useState<null | number>(0);
    const [selectedPlantLocation, setSelectedPlantLocation] =
      useState<PlantLocation | null>(null);
    const [_selectedSamplePlantLocation, setSelectedSamplePlantLocation] =
      useState<SamplePlantLocation | null>(null);

    return (
      <ProjectSiteDropdown
        projectSites={options}
        selectedSite={selectedSite}
        setSelectedSite={(index) => {
          setSelectedSite(index);
        }}
        selectedPlantLocation={selectedPlantLocation}
        setSelectedPlantLocation={setSelectedPlantLocation}
        setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
      />
    );
  },
};
