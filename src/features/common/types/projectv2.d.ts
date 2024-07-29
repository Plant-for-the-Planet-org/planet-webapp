import {
  ProjectMapInfo,
  TreeProjectConcise,
  ConservationProjectConcise,
} from '@planet-sdk/common/build/types/project/map';

export type MapProjectProperties =
  | TreeProjectConcise
  | ConservationProjectConcise;

export type MapProject = ProjectMapInfo<MapProjectProperties>;
