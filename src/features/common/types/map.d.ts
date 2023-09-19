import {
    TreeProjectClassification,
    CountryCode,
    CurrencyCode,
    TreeProjectMetadata,
    DefaultPaymentConfig,
    Tpo,
    UnitTypes
} from "@planet-sdk/common"
import { Nullable } from '@planet-sdk/common/build/types/util';
import { ContributionProps } from "../../user/RegisterTrees/RegisterTrees/SingleContribution";



export interface ViewportProps {
    height: string | number;
    width:  string | number;
    latitude?: number;
    longitude?: number;
    zoom: number[] | number
    center?: number[]
}

export interface ProjectGeoJsonProps {
    type: 'Feature';
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      allowDonations: boolean;
      classification: TreeProjectClassification;
      countPlanted: number;
      countTarget: number;
      country: CountryCode;
      currency: CurrencyCode;
      id: string;
      image: string;
      isApproved: boolean;
      isFeatured: boolean;
      isTopProject: boolean;
      location: Nullable<string>;
      metadata: TreeProjectMetadata;
      minTreeCount: number;
      name: string;
      paymentDefaults: Nullable<DefaultPaymentConfig>;
      purpose: 'trees';
      unit: 'tree';
      slug: string;
      taxDeductionCountries: CountryCode[];
      tpo: Tpo;
      treeCost: number;
      unitCost: number;
      unitType: UnitTypes;
    };
  }
  
  
  export interface RegisterTreeGeometry {
    coordinates: [number, number] | number[][];
    type: 'Polygon' | 'Point';
}

  export interface RegisterTreesFormProps {
    setContributionGUID: React.Dispatch<React.SetStateAction<string>>;
    setContributionDetails: React.Dispatch<
      React.SetStateAction<ContributionProps>
    >;
    setRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  }