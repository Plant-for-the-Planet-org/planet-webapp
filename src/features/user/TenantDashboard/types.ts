import type { CountryCode } from '@planet-sdk/common';

export interface RecentDonorApi {
  units: number;
  unitType: 'tree' | 'm2';
  created: string;
  donor: string;
}

export interface CountryLeaderboardApi {
  donor_country: CountryCode;
  trees: string;
}

export interface Global {
  tenant: string;
  totalDonated: number;
  totalPlanted: number;
  totalRestored: number;
  countries: number;
  uniqueDonors: number;
  currency: string;
}

export interface Country {
  country: CountryCode;
  trees: number;
}

export interface TenantStatsApi {
  global: Global;
  countries: Country[];
}
