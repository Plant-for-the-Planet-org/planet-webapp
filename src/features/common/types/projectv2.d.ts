import {
  ConservationProjectExtended,
  TreeProjectExtended,
} from '@planet-sdk/common';
import {
  ProjectMapInfo,
  TreeProjectConcise,
  ConservationProjectConcise,
} from '@planet-sdk/common/build/types/project/map';
import { Nullable } from '@planet-sdk/common/build/types/util';

export type MapProjectProperties =
  | TreeProjectConcise
  | ConservationProjectConcise;

export type ExtendedProject = TreeProjectExtended | ConservationProjectExtended;

export type MapProject = ProjectMapInfo<MapProjectProperties>;

export interface Image {
  image: string;
  description: Nullable<string>;
  id: string;
}

export type SliderImage = {
  image?: string | undefined;
  description?: string | null;
};
