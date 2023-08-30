import { UserType, Score } from '@planet-sdk/common';

// TODOO - add PublicUser type to common sdk
export interface PublicUser {
  id: string;
  slug: string;
  type: UserType;
  image?: string;
  url?: string;
  urlText?: string;
  displayName: string;
  score: Score;
  supportedProfile?: string;
  /** @deprecated do not use */
  isReviewer: boolean;
  bio?: string;
  /** @deprecated do not use */
  hasLogoLicense?: boolean;
}

export interface AddressSuggestionsType {
  isCollection: boolean;
  magicKey: string;
  text: string;
}

interface SpatialReference {
  wkid: number;
  latestWkid: number;
}

interface Location {
  x: number;
  y: number;
}

interface Attributes {
  Loc_name: string;
  Status: string;
  Score: number;
  Match_addr: string;
  LongLabel: string;
  ShortLabel: string;
  Addr_type: string;
  Type: string;
  PlaceName: string;
  Place_addr: string;
  Phone: string;
  URL: string;
  Rank: number;
  AddBldg: string;
  AddNum: string;
  AddNumFrom: string;
  AddNumTo: string;
  AddRange: string;
  Side: string;
  StPreDir: string;
  StPreType: string;
  StName: string;
  StType: string;
  StDir: string;
  BldgType: string;
  BldgName: string;
  LevelType: string;
  LevelName: string;
  UnitType: string;
  UnitName: string;
  SubAddr: string;
  StAddr: string;
  Block: string;
  Sector: string;
  Nbrhd: string;
  District: string;
  City: string;
  MetroArea: string;
  Subregion: string;
  Region: string;
  RegionAbbr: string;
  Territory: string;
  Zone: string;
  Postal: string;
  PostalExt: string;
  Country: string;
  CntryName: string;
  LangCode: string;
  Distance: number;
  X: number;
  Y: number;
  DisplayX: number;
  DisplayY: number;
  Xmin: number;
  Xmax: number;
  Ymin: number;
  Ymax: number;
  ExInfo: string;
}

interface Extent {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

interface Candidate {
  address: string;
  location: Location;
  score: number;
  attributes: Attributes;
  extent: Extent;
}

interface AddressType {
  spatialReference: SpatialReference;
  candidates: Candidate[];
}
