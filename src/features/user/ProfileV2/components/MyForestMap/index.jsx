import MapGL, { NavigationControl } from 'react-map-gl';
import { useState, useEffect, useRef, useMemo } from 'react';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import {
  ConservAreaClusterMarker,
  TreePlantedClusterMarker,
} from './ClusterMarker';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import Supercluster from 'supercluster';
import SingleMarker from './SingleMarker';
import ShowAllMarker from './TreesPlantedMarkers';
import TreesPlantedMarkers from './TreesPlantedMarkers';

const MyForestMap = ({ geoJson }) => {
  const mapRef = useRef(null);
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };

  const [clusters, setClusters] = useState([]);
  const [totalTreesForAnCluster, setTotalTreesForAnCluster] = useState([]);
  const [mapState, setMapState] = useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 25,
  });
  const defaultMapCenter = [36.96, -28.5];
  let defaultZoom = 1.4;
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  useEffect(() => {
    //loads the default mapstyle
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);
  // handles viewport state
  const _handleViewport = (newViewport) =>
    setViewport({ ...viewport, ...newViewport });

  const _fetchData = () => {
    const supercluster = new Supercluster({
      radius: 60,
      maxZoom: 5,
      map: (props) => ({
        totalTrees: props.quantity,
      }),
      reduce: (accumulator, props) => {
        if (props.totalTrees) {
          accumulator.totalTrees = accumulator.totalTrees + props.totalTrees;
        }
      },
    });
    supercluster.load(geoJson);
    // const { zoom } = viewport;
    const map = mapRef.current ? mapRef.current.getMap() : null;
    const bounds = map ? map.getBounds().toArray().flat() : null;
    const bound = bounds ? [bounds[0], bounds[1], bounds[2], bounds[3]] : null;
    if (viewport?.viewState?.zoom) {
      const _clusters = supercluster?.getClusters(
        bound,
        viewport?.viewState?.zoom
      );
      setClusters(_clusters);
      return _clusters;
    }
  };
  console.log(clusters, '==');
  useEffect(() => {
    if (geoJson) {
      _fetchData();
    }
  }, [viewport, geoJson]);

  return (
    geoJson && (
      <div className={MyForestMapStyle.mapContainer}>
        <MapGL
          ref={mapRef}
          {...mapState}
          {...viewport}
          onViewStateChange={_handleViewport}
        >
          <TreesPlantedMarkers geoJson={clusters} />
          <NavigationControl showCompass={false} />
        </MapGL>
      </div>
    )
  );
};

export default MyForestMap;
