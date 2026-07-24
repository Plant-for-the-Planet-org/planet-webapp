import type { MapProject } from '../../../common/types/projectv2';

// Shared mock used to seed the project store in ProjectListControls stories.
// cspell:disable
export const mockProjects: MapProject[] = [
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
      fixedRates: [],
      image: '5f50cf393d87b408808590.jpeg',
      isApproved: false,
      isFeatured: false,
      isPublished: true,
      isTopProject: false,
      location: 'Kil County, Kenya',
      minTreeCount: 1,
      name: 'Community Mangrove Restoration, Kenya',
      paymentDefaults: {
        fixedTreeCountOptions: [10, 25, 50, 100],
        fixedDefaultTreeCount: 5,
      },
      purpose: 'trees',
      reviewScore: 0,
      reviews: [],
      slug: 'community-mangrove-restoration-kenya',
      taxDeductionCountries: [],
      tpo: {
        image: '62f17359ebb67864676307.png',
        address: {
          id: 'addr_climate_impact_partners',
          type: 'primary',
          address: '1007 Johnnie Blvd, Suite 134',
          address2: null,
          city: 'Mount Pleasant',
          zipCode: '29464',
          country: 'US',
          state: 'SC',
          isPrimary: true,
          name: 'Climate Impact Partners',
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
];
// cspell:enable
