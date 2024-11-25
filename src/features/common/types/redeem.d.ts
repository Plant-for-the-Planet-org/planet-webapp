import type {
  CountryCode,
  ProjectPurpose,
  UnitTypes,
} from '@planet-sdk/common';
import type { Nullable } from '@planet-sdk/common/build/types/util';

export interface Organization {
  name: string;
  slug: string;
}
export interface Project {
  id: string;
  name: string;
  slug: string;
  image: Nullable<string>;
  country: CountryCode;
  purpose: ProjectPurpose;
  classification: Nullable<string>;
  coordinates: number[];
  organization: Organization;
}

export interface RedeemedCodeData {
  guid: string;
  type: 'invitation' | 'code';
  code: string;
  units: number;
  unitType: UnitTypes;
  recipientName: string;
  recipientEmail: Nullable<string>;
  message: Nullable<string>;
  notifyRecipient: boolean;
  status: string;
  project: Project;
}
