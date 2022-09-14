export interface Project {
  guid: string;
  slug: string;
  name: string;
  unitCost: number;
  currency: string;
  unit?: string;
  purpose: string;
  allowDonations: boolean;
}

export interface SingleProject {
  id: string;
  name: string;
  slug: string;
  allowDonations: boolean;
  purpose: string;
  currency: string;
  unitCost: number;
}
