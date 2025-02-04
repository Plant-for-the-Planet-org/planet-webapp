import type { SingleExploreLayerConfig } from '../../features/projectsV2/ProjectsMapContext';

export const tempLayersData: SingleExploreLayerConfig[] = [
  {
    uuid: '27b2eadb-b267-44cc-b81a-ae79a7219c80',
    name: 'Soil Bulk Density',
    description: 'test',
    earthEngineAssetId: 'projects/planet-layers-api/assets/BulkDensity',
    visParams: {
      max: 188,
      min: 29,
      palette: [
        '#0000FF',
        '#4060FF',
        '#80A0FF',
        '#B0C8FF',
        '#E0F0FF',
        '#FFFFE0',
        '#FFF8C0',
        '#FFF080',
        '#FFFF00',
        '#F9A602',
        '#F97B02',
        '#F95000',
        '#D92A00',
        '#BF0A30',
      ],
    },
    zoomConfig: { maxZoom: 5, minZoom: 0 },
    tileUrl:
      'https://storage.googleapis.com/planet-layers/27b2eadb-b267-44cc-b81a-ae79a7219c80/2025/1/{z}/{x}/{y}.png',
    googleEarthUrl:
      'https://earth.google.com/web/c/CvoCYvcCCvQCaHR0cHM6Ly9lYXJ0aC1rbWwuYXBwc3BvdC5jb20vP2xpbms9aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3BsYW5ldC1sYXllcnMvMjdiMmVhZGItYjI2Ny00NGNjLWI4MWEtYWU3OWE3MjE5YzgwLzIwMjUvMS8kJTVCbGV2ZWwlNUQvJCU1QnglNUQvJCU1QnklNUQucG5nJmljb249aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2VhcnRoLWttbC5hcHBzcG90LmNvbS9ub19pY29uLnBuZyZuYW1lPWxheWVyLTI3YjJlYWRiLWIyNjctNDRjYy1iODFhLWFlNzlhNzIxOWM4MC1leHBvcnQtdGlsZXMtMTczODI2MTI5MzE0NCZub3J0aD04Ni4wJnNvdXRoPS04Ni4wJmVhc3Q9MTgwLjAmd2VzdD0tMTgwLjAmbWluTGV2ZWw9MCZtYXhMZXZlbD01',
    metadata: {},
    enabled: true,
    createdAt: '2025-01-30T18:21:32.587Z',
    updatedAt: '2025-01-30T18:28:00.451Z',
  },
  {
    uuid: '1b254c1d-bc89-4f7d-b75d-c0b41e7bf310',
    name: 'Forest Cover',
    description: 'test',
    earthEngineAssetId: 'projects/planet-layers-api/assets/ForestCover',
    visParams: { max: 1, min: 1, palette: ['white', '#006400'] },
    zoomConfig: { maxZoom: 5, minZoom: 0 },
    tileUrl:
      'https://storage.googleapis.com/planet-layers/1b254c1d-bc89-4f7d-b75d-c0b41e7bf310/2025/1/{z}/{x}/{y}.png',
    googleEarthUrl:
      'https://earth.google.com/web/c/CvoCYvcCCvQCaHR0cHM6Ly9lYXJ0aC1rbWwuYXBwc3BvdC5jb20vP2xpbms9aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3BsYW5ldC1sYXllcnMvMWIyNTRjMWQtYmM4OS00ZjdkLWI3NWQtYzBiNDFlN2JmMzEwLzIwMjUvMS8kJTVCbGV2ZWwlNUQvJCU1QnglNUQvJCU1QnklNUQucG5nJmljb249aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2VhcnRoLWttbC5hcHBzcG90LmNvbS9ub19pY29uLnBuZyZuYW1lPWxheWVyLTFiMjU0YzFkLWJjODktNGY3ZC1iNzVkLWMwYjQxZTdiZjMxMC1leHBvcnQtdGlsZXMtMTczODI2NDIwNjI3NCZub3J0aD04Ni4wJnNvdXRoPS04Ni4wJmVhc3Q9MTgwLjAmd2VzdD0tMTgwLjAmbWluTGV2ZWw9MCZtYXhMZXZlbD01',
    metadata: {},
    enabled: true,
    createdAt: '2025-01-30T19:10:05.281Z',
    updatedAt: '2025-01-30T19:19:00.341Z',
  },
  {
    uuid: 'd8439605-3259-479b-80d6-540bb949940a',
    name: 'Biomass Potential',
    description: 'test',
    earthEngineAssetId: 'projects/planet-layers-api/assets/BiomassPotential',
    visParams: {
      max: 257.1201171875,
      min: 0.1,
      palette: [
        '#FFFFE0',
        '#FFF8C0',
        '#FFF080',
        '#FFFF00',
        '#A0D070',
        '#80B050',
        '#609030',
        '#407010',
        '#205000',
        '#003000',
      ],
    },
    zoomConfig: { maxZoom: 5, minZoom: 0 },
    tileUrl:
      'https://storage.googleapis.com/planet-layers/d8439605-3259-479b-80d6-540bb949940a/2025/1/{z}/{x}/{y}.png',
    googleEarthUrl:
      'https://earth.google.com/web/c/CvoCYvcCCvQCaHR0cHM6Ly9lYXJ0aC1rbWwuYXBwc3BvdC5jb20vP2xpbms9aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3BsYW5ldC1sYXllcnMvZDg0Mzk2MDUtMzI1OS00NzliLTgwZDYtNTQwYmI5NDk5NDBhLzIwMjUvMS8kJTVCbGV2ZWwlNUQvJCU1QnglNUQvJCU1QnklNUQucG5nJmljb249aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2VhcnRoLWttbC5hcHBzcG90LmNvbS9ub19pY29uLnBuZyZuYW1lPWxheWVyLWQ4NDM5NjA1LTMyNTktNDc5Yi04MGQ2LTU0MGJiOTQ5OTQwYS1leHBvcnQtdGlsZXMtMTczODI2NTEzOTQwMiZub3J0aD04Ni4wJnNvdXRoPS04Ni4wJmVhc3Q9MTgwLjAmd2VzdD0tMTgwLjAmbWluTGV2ZWw9MCZtYXhMZXZlbD01',
    metadata: {},
    enabled: true,
    createdAt: '2025-01-30T19:25:38.896Z',
    updatedAt: '2025-01-30T19:36:00.416Z',
  },
];
