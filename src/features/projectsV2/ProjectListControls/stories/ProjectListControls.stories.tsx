import ProjectListControls from '..';
import ActiveSearchField from '../microComponents/ActiveSearchField';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta<typeof ProjectListControls> = {
  title: 'Projects/Landing/ProjectListControls',
  component: ProjectListControls,
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
  },
};

export default meta;
type Story = StoryObj<typeof ProjectListControls>;

export const Default: Story = {
  args: {
    projectCount: 20,
    topProjectCount: 30,
    selectedClassification: [],
    filteredProjects: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [39.85994, -3.6281000553331],
        },
        properties: {
          id: 'pi_StWEs2TGZFPfQoLC',
          _scope: 'map',
          allowDonations: false,
          classification: 'mangroves',
          countPlanted: 90000,
          countTarget: 90000,
          country: 'KE',
          currency: 'INR',
          fixedRates: null,
          image: '5f50cf393d87b408808590.jpeg',
          isApproved: false,
          isFeatured: false,
          isPublished: true,
          isTopProject: false,
          location: 'Kilifi County, Kenya',
          minTreeCount: 1,
          name: 'Community Mangrove Restoration, Kenya',
          paymentDefaults: {
            fixedTreeCountOptions: [10, 25, 50, 100],
            fixedDefaultTreeCount: 5,
          },
          purpose: 'trees',
          reviews: [],
          slug: 'community-mangrove-restoration-kenya',
          taxDeductionCountries: [],
          tpo: {
            image: '62f17359ebb67864676307.png',
            address: {
              zipCode: '29464',
              country: 'US',
              address: '1007 Johnnie Dodds Blvd, Suite 134',
              city: 'Mount Pleasant',
            },
            name: 'Climate Impact Partners',
            id: 'tpo_6CjTMsBqdVKNbZKq5hlGBLji',
            email: 'rfay@naturalcapitalpartners.com',
            slug: 'natural-capital-partners',
          },
          treeCost: 255.62,
          unitCost: 255.62,
          unitType: 'tree',
          unitsContributed: {
            tree: 90000,
          },
          unitsTargeted: {
            tree: 90000,
          },
          description: null,
          options: [],
          ecosystem: 'mangroves',
        },
      },
    ],
    isSearching: true,
  },
  render: (args) => {
    const [tabSelected, setTabSelected] = useState(args.tabSelected);
    const [selectedClassification, setSelectedClassification] = useState(
      args.selectedClassification
    );
    const [isSearching, setIsSearching] = useState(false);
    const handleSearch = () => {
      setIsSearching(true);
    };
    if (isSearching) {
      return (
        <ActiveSearchField
          setIsSearching={setIsSearching}
          setIsFilterOpen={() => {}}
          setDebouncedSearchValue={(value) =>
            window.alert(`Search value: ${value}`)
          }
        />
      );
    }
    return (
      <ProjectListControls
        {...args}
        tabSelected={tabSelected}
        setTabSelected={(tab) => {
          setTabSelected(tab);
        }}
        selectedClassification={selectedClassification}
        setSelectedClassification={(classification) =>
          setSelectedClassification(classification)
        }
        setDebouncedSearchValue={handleSearch}
      />
    );
  },
};
