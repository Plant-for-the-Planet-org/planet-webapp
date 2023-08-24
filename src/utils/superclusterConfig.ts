import { TestPointProps, TestClusterProps,  Bound, } from "../features/common/types/map";
import Supercluster from 'supercluster';

const _clusterConfig = {
    radius: 40,
    maxZoom: 5,
    map: (props: TestPointProps): TestClusterProps => ({
      totalTrees: props.quantity,
    }),
    reduce: (accumulator: any, props: any) => {
      if (props.totalTrees) {
        accumulator.totalTrees =
          Number(accumulator.totalTrees) + Number(props.totalTrees);
      }
    },
  };

  export const _getClusterGeojson = (viewState,mapRef,geoJson) => {
    const supercluster = new Supercluster(_clusterConfig);
    supercluster.load(geoJson);
    const zoom = viewState?.zoom;
    if (mapRef && mapRef.current !== null) {
      const map = mapRef.current.getMap();
      const bounds = map.getBounds().toArray().flat();
      const bound: Bound = bounds && [
        bounds[0],
        bounds[1],
        bounds[2],
        bounds[3],
      ];
      if (zoom) {
        const _clusters = supercluster?.getClusters(bound, zoom);
        return _clusters;
      }
    }
  };