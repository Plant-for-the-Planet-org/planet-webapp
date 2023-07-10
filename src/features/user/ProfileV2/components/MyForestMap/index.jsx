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

const MyForestMap = () => {
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
  const defaultZoom = 1.4;
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

  const data = [
    {
      id: 1,
      latitude: 24.448663786063683,
      longitude: 74.47891682493132,
      tree: 4,
    },
    {
      id: 2,
      latitude: 28.19781589503853,
      longitude: 73.73012300482546,
      tree: 3,
    },
    {
      id: 3,
      latitude: 25.35105605879828,
      longitude: 72.81894668056721,
      tree: 2,
    },
    {
      id: 4,
      latitude: 25.35105605879828,
      longitude: 72.81894668056721,
      tree: 2,
    },
    {
      id: 5,
      latitude: 60.14489538255161,
      longitude: 94.86732431850223,
      tree: 2,
    },
    {
      id: 6,
      latitude: 56.599360718231154,
      longitude: 92.40664761458488,
      tree: 2,
    },
    {
      id: 7,
      latitude: 59.547181850321174,
      longitude: -106.27307737774926,
      tree: 3,
    },
    {
      id: 8,
      latitude: 60.85727082347711,
      longitude: -104.16370232636427,
      tree: 3,
    },
  ];

  const points = useMemo(() => {
    return data.map((item) => ({
      type: 'Feature',
      properties: {
        cluster: false,
        id: item.id,
        tree: item.tree,
      },
      geometry: {
        type: 'Point',
        coordinates: [item.longitude, item.latitude],
      },
    }));
  }, [data]);

  const _countTotaltreesOfAnCluster = (clusters, supercluster) => {
    if (clusters) {
      const _countTree = clusters.map((singleCluster) => {
        // fetching list of markers associates to an cluster
        const _leaves = supercluster.getLeaves(
          singleCluster?.properties.cluster_id,
          Infinity,
          0
        );
        // adding  the total number of trees associates to an cluster
        const _addingtreesAnCluster = _leaves.reduce((accumulator, point) => {
          return accumulator + point?.properties?.tree;
        }, 0);

        const _treeInfo = {
          totalTrees: _addingtreesAnCluster,
          clusterId: singleCluster.properties.cluster_id,
        };
        return _treeInfo;
      });
      setTotalTreesForAnCluster(_countTree);
    }
  };

  const _fetchData = () => {
    const supercluster = new Supercluster({
      radius: 60,
      maxZoom: 2,
    });
    supercluster.load(points);
    const { zoom } = viewport;

    const map = mapRef.current ? mapRef.current.getMap() : null;
    const bounds = map ? map.getBounds().toArray().flat() : null;
    const bound = bounds ? [bounds[0], bounds[1], bounds[2], bounds[3]] : null;

    const _clusters = supercluster?.getClusters(bound, zoom);
    _countTotaltreesOfAnCluster(_clusters, supercluster);
    setClusters(_clusters);
    return _clusters;
  };

  useEffect(() => {
    _fetchData();
  }, [viewport]);

  return (
    <div className={MyForestMapStyle.mapContainer}>
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        onViewStateChange={_handleViewport}
      >
        {clusters &&
          viewport.viewState?.zoom < 4.65 &&
          clusters.map((point, key) => {
            return (
              <TreePlantedClusterMarker
                key={key}
                project={point}
                treesInfo={totalTreesForAnCluster}
              />
            );
          })}

        {points &&
          viewport.viewState?.zoom > 4.65 &&
          points.map((marker, key) => {
            return <SingleMarker key={key} coordinates={marker} />;
          })}

        {/* {contribution.map((project) => {
          if (
            (isTreePlantedButtonActive && project.purpose === 'trees') ||
            (isConservedButtonActive && project.purpose === 'conservation') ||
            (!isTreePlantedButtonActive && !isConservedButtonActive)
          ) {
            return (
              <>
                {project.purpose === 'trees' && (
                  <TreePlantedClusterMarker
                    key={project.plantProject.guid}
                    project={project}
                  />
                )}
                {project.purpose === 'conservation' && (
                  <ConservAreaClusterMarker
                    key={project.plantProject.guid}
                    latitude={project.plantProject.geoLatitude}
                    longitude={project.plantProject.geoLongitude}
                  />
                )}
              </>
            );
          }
        })} */}
        {/* {contribution.map((project) => {
          if (project.purpose === 'bouquet') {
            return project.bouquetContributions.map((bouquetProject) => {
              console.log(bouquetProject, 'oooooo');
              return (
                <TreePlantedClusterMarker
                  key={bouquetProject.plantProject.guid}
                  project={bouquetProject}
                />
              );
            });
          }
        })} */}
        <NavigationControl showCompass={false} />
      </MapGL>
    </div>
  );
};

export default MyForestMap;
