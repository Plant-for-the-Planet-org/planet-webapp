import type {
  DistinctSpecies,
  DataExplorerInterventionFeature,
  InterventionDetailsApiResponse,
  InterventionFeatureCollection,
  Feature,
  FeatureCollection,
  SingleInterventionApiResponse,
} from '../../../../../common/types/dataExplorer';
import type { ProjectType } from '../ProjectTypeSelector';
import type { ChangeEvent, MutableRefObject } from 'react';
import type { ViewportProps, MapRef, MapEvent } from 'react-map-gl';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Search } from '@mui/icons-material';
import moment from 'moment';
import 'mapbox-gl/dist/mapbox-gl.css';
import center from '@turf/center';
import area from '@turf/area';
import MapGL, { Layer, NavigationControl, Source } from 'react-map-gl';

import { Container } from '../Container';
import useNextRequest, {
  HTTP_METHOD,
} from '../../../../../../hooks/use-next-request';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import LeftControls from './components/LeftControls';
import styles from './index.module.scss';
import getMapStyle from '../../../../../../utils/maps/getMapStyle';
import { QueryType } from '../../constants';
import {
  format,
  isAfter,
  isBefore,
  isEqual,
  isValid,
  parse,
  parseISO,
} from 'date-fns';
import InterventionDetails from './components/InterventionDetails';
import MapCredit from './components/MapCredit';
import { useDebouncedEffect } from '../../../../../../utils/useDebouncedEffect';
import themeProperties from '../../../../../../theme/themeProperties';
import { useErrorHandlingStore } from '../../../../../../stores/errorHandlingStore';

const EMPTY_STYLE = {
  version: 8,
  sources: {},
  layers: [],
};

const defaultMapCenter = [0, 0];
const defaultZoom = 1.4;

const getPolygonOpacity = (density: number) => {
  if (density > 2500) {
    return 0.5;
  } else if (density > 2000) {
    return 0.4;
  } else if (density > 1600) {
    return 0.3;
  } else if (density > 1000) {
    return 0.2;
  } else {
    return 0.1;
  }
};

function isDateBetween(
  searchDateStr: string,
  fromDateStr: Date,
  toDateStr: Date
) {
  const searchDate = parse(searchDateStr, 'yyyy-MM-dd', new Date());
  const fromDate = new Date(fromDateStr);
  const toDate = new Date(toDateStr);

  // Check if searchDate is equal to or after fromDate
  const isAfterOrEqualFrom =
    isAfter(searchDate, fromDate) || isEqual(searchDate, fromDate);

  // Check if searchDate is equal to or before toDate
  const isBeforeOrEqualTo =
    isBefore(searchDate, toDate) || isEqual(searchDate, toDate);

  return isAfterOrEqualFrom && isBeforeOrEqualTo;
}

export const MapContainer = () => {
  const { project, fromDate, toDate } = useAnalytics();
  const { primaryColor } = themeProperties.designSystem.colors;
  const t = useTranslations('TreemapperAnalytics');

  const mapRef: MutableRefObject<MapRef | null> = useRef(null);
  const [mapState, setMapState] = useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 25,
  });
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  useEffect(() => {
    //loads the default map style
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);

  const [viewport, setViewport] = useState<ViewportProps>({
    width: '100%',
    height: '500px',
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const [_projectType, setProjectType] = useState<ProjectType | null>(null);
  const [distinctSpeciesList, setDistinctSpeciesList] =
    useState<DistinctSpecies>([]);
  const [species, setSpecies] = useState<string | null>(null);
  const [projectSites, setProjectSites] = useState<FeatureCollection | null>(
    null
  );
  const [projectSite, setProjectSite] = useState<Feature | null>(null);
  const [interventions, setInterventions] =
    useState<InterventionFeatureCollection | null>(null);
  const [interventionDetails, setInterventionDetails] = useState<
    InterventionDetailsApiResponse['res'] | null
  >(null);
  const [selectedLayer, setSelectedLayer] = useState<
    DataExplorerInterventionFeature['properties'] | null
  >(null);
  const [search, setSearch] = useState<string>('');
  const [queryType, setQueryType] = useState<QueryType | null>(null);

  const [loading, setLoading] = useState(false);

  // Custom hook for making requests to fetch distinct species
  const { makeRequest } = useNextRequest<{ data: DistinctSpecies }>({
    url: `/api/data-explorer/map/distinct-species/${project?.id}`,
    method: HTTP_METHOD.GET,
  });

  // Custom hook for making requests to fetch project sites
  const { makeRequest: makeReqToFetchProjectSites } = useNextRequest<{
    data: FeatureCollection;
  }>({
    url: `/api/data-explorer/map/sites/${project?.id}`,
    method: HTTP_METHOD.GET,
  });

  // Custom hook for making requests to fetch interventions
  const { makeRequest: makeReqToFetchInterventions } = useNextRequest<{
    data: SingleInterventionApiResponse[];
  }>({
    url: `/api/data-explorer/map/intervention`,
    method: HTTP_METHOD.POST,
    body: {
      projectId: project?.id,
      species: species,
      queryType: queryType,
      searchQuery: search,
      fromDate: format(new Date(fromDate), 'yyyy-MM-dd'),
      toDate: format(new Date(toDate), 'yyyy-MM-dd'),
    },
  });

  // Custom hook for making requests to fetch intervention details
  const { makeRequest: makeReqToFetchInterventionDetails } =
    useNextRequest<InterventionDetailsApiResponse>({
      url: `/api/data-explorer/map/intervention/${selectedLayer?.guid}`,
      method: HTTP_METHOD.GET,
    });

  const fetchProjectLocationsDetails = async () => {
    if (selectedLayer) {
      setLoading(true);
      const { res } =
        (await makeReqToFetchInterventionDetails()) as InterventionDetailsApiResponse;
      setInterventionDetails(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectLocationsDetails();
  }, [selectedLayer]);

  // Fetch and Set Distinct Species and Project Sites.
  // This data will be consumed by the dropdowns in the left controls
  const fetchDistinctSpecies = async () => {
    const res = await makeRequest();
    if (res) {
      setDistinctSpeciesList(res.data);
      setSpecies(res.data[0] ? res.data[0] : null);
    }
  };

  const fetchProjectSites = async () => {
    const res = await makeReqToFetchProjectSites();
    if (res) {
      setProjectSites(res.data);
      setProjectSite(res.data.features[0] ? res.data.features[0] : null);
    }
  };

  useEffect(() => {
    if (project) {
      fetchDistinctSpecies();
      fetchProjectSites();
    }
    setSelectedLayer(null);
  }, [project]);

  // Programmatically navigate to another location on the map
  const _setViewport = (
    feature: Feature | DataExplorerInterventionFeature,
    zoom = 16
  ) => {
    let centroid;

    if (feature.geometry === null) {
      centroid = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: defaultMapCenter,
        },
      };
      zoom = 0;
    } else {
      centroid = center(feature);
    }

    if (centroid?.geometry) {
      const [longitude, latitude] = centroid.geometry.coordinates;
      setViewport({
        latitude,
        longitude,
        zoom,
        width: '100%',
        height: '500px',
      });
    }
  };

  // Fetch and Set Plant Locations
  // This data will be used to render the plant locations on the map
  const fetchProjectLocations = async () => {
    setLoading(true);
    const res = await makeReqToFetchInterventions();
    if (res) {
      if (res.data.length === 0) {
        setInterventionDetails(null);
      }

      const interventionFeatures: DataExplorerInterventionFeature[] =
        res.data.map((intervention) => {
          // Calculate the area based on the feature's coordinates using Turf.js
          const polygonAreaSqMeters = area(intervention.geometry);
          const treeCount = intervention.properties.treeCount;
          const density =
            polygonAreaSqMeters > 0 ? treeCount / polygonAreaSqMeters : 0;

          // Add the calculated density to the feature properties
          return {
            geometry: intervention.geometry,
            type: intervention.type,
            properties: {
              ...intervention.properties,
              density: density,
              opacity: getPolygonOpacity(density),
            },
          };
        });

      const _featureCollection = {
        type: 'FeatureCollection',
        features: interventionFeatures,
      };
      setInterventions(_featureCollection as InterventionFeatureCollection);
      if (interventionFeatures.length > 0) {
        const defaultFeature = interventionFeatures[0];
        _setViewport(defaultFeature);
        setSelectedLayer(
          interventionFeatures[0] ? interventionFeatures[0].properties : null
        );
      }
    }
    setLoading(false);
  };

  useDebouncedEffect(
    () => {
      if (project && species) {
        if (queryType === QueryType.DATE) {
          if (!isDateBetween(search, fromDate, toDate)) {
            setErrors([{ message: t('searchDateError') }]);
            return;
          }
        }
        fetchProjectLocations();
      }
    },
    500,
    [project, species, queryType, fromDate, toDate]
  );

  // Set the map style to the default style
  // Currently this only shows Intervention
  const handleProjectTypeChange = (projType: ProjectType | null) => {
    setProjectType(projType);
  };

  // Set the selected site on the map
  // Navigate to the selected site on the map
  const handleSiteChange = (site: Feature | null) => {
    setProjectSite(site);
    if (site) {
      _setViewport(site, 13.5);
    }
  };

  // Handle map click event
  // This will be used to select a plant location on the map
  const handleMapClick = async (event) => {
    const clickedFeatures = event.features;
    if (clickedFeatures.length > 0) {
      const clickedLayerProperties = clickedFeatures[0].properties;
      // Check if the clicked feature is a different plant location using guid
      if (
        Object.keys(clickedLayerProperties).length !== 0 &&
        clickedLayerProperties.guid !== undefined &&
        clickedLayerProperties.guid !== selectedLayer?.guid
      ) {
        setSelectedLayer(clickedLayerProperties);
      }
    }
  };

  const onMouseEnter = useCallback((event: MapEvent) => {
    if (event.features && event.features.length > 0) {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.getCanvas().style.cursor = 'pointer';
      }
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.getCanvas().style.cursor = '';
    }
  }, []);

  // Handle search input change
  // This will be used to filter the plant locations on the map based on the search input
  // The search input can be either a HID or a Date
  // If the input is a HID, the plant location with the matching HID will be selected
  // If the input is a Date, the plant locations with the matching Date will be selected
  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement> | ClipboardEvent
  ) => {
    let value = '';

    if ('target' in event && event.target instanceof HTMLInputElement) {
      value = event.target.value;
    } else if ('clipboardData' in event && event.clipboardData) {
      value = event.clipboardData.getData('text/plain') || '';
    }
    value = value.trim();
    setSearch(value);

    // Regular expression for HID (6 letters, A-Z and 0-9)
    const hidRegex = /^[A-Za-z0-9]{6}$/;

    // Regular expression for Date (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (value.length === 6) {
      if (hidRegex.test(value)) {
        console.log('Valid HID input:', value);
        setQueryType(QueryType.HID);
      } else {
        console.log('Not a valid HID input:', value);
        setQueryType(null);
      }
    } else if (dateRegex.test(value)) {
      if (isValid(parseISO(value))) {
        console.log('Valid Date input:', value);
        setQueryType(QueryType.DATE);
      } else {
        console.log('Not a valid Date:', value);
      }
    } else {
      console.log('Not a valid input:', value);
      setQueryType(null);
    }
  };

  // Handle viewport change
  // This will be used to update the viewport state
  // If not present then it will cause a weird behavior of map where will not
  // move to the updated selected location --(happens when data changes based on filter)--
  const _handleViewport = (newViewport: ViewportProps) =>
    setViewport({ ...viewport, ...newViewport });

  return (
    <Container
      leftElement={
        <LeftControls
          {...{
            handleProjectTypeChange,
            distinctSpeciesList,
            species,
            setSpecies,
            projectSites,
            projectSite,
            handleSiteChange,
          }}
        />
      }
      rightElement={
        <TextField
          style={{ minWidth: '150px' }}
          label={t('search')}
          InputProps={{
            startAdornment: <Search />,
          }}
          value={search}
          placeholder={moment().format('YYYY-MM-DD')}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e)}
          onPaste={handleSearchChange}
        />
      }
      overrideBodyStyles={styles.body}
    >
      <div className={styles.mapContainer}>
        {interventions && projectSites ? (
          <>
            <MapGL
              ref={mapRef}
              {...mapState}
              {...viewport}
              onViewStateChange={_handleViewport}
              onViewportChange={(viewport) => setViewport(viewport)}
              onClick={handleMapClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              interactiveLayerIds={['point-layer', 'plant-locations-fill']}
            >
              <Source type="geojson" data={interventions}>
                <Layer
                  id={`point-layer`}
                  type="circle"
                  paint={{
                    'circle-color': `${primaryColor}`,
                    'circle-opacity': 0.5,
                  }}
                  filter={['==', ['geometry-type'], 'Point']}
                />
                <Layer
                  id="plant-locations-fill"
                  type="fill"
                  paint={{
                    'fill-color': `${primaryColor}`,
                    'fill-opacity': ['get', 'opacity'],
                  }}
                />
                <Layer
                  id="plant-locations-line"
                  type="line"
                  paint={{
                    'line-color': [
                      'case',
                      ['==', ['get', 'guid'], selectedLayer?.guid],
                      `${primaryColor}`,
                      'transparent',
                    ],
                    'line-width': 4,
                  }}
                />
              </Source>

              <Source type="geojson" data={projectSites}>
                <Layer
                  type="line"
                  paint={{
                    'line-color': `${primaryColor}`,
                    'line-width': 4,
                  }}
                />
              </Source>
              <div className={styles.navigationControlContainer}>
                <NavigationControl showCompass={false} />
              </div>
              {selectedLayer && (
                <InterventionDetails
                  selectedLayer={selectedLayer}
                  interventionDetails={interventionDetails}
                  loading={loading}
                />
              )}
            </MapGL>
            <div className={styles.mapCreditContainer}>
              <MapCredit />
            </div>
          </>
        ) : (
          <div className={styles.spinner} />
        )}
      </div>
    </Container>
  );
};
