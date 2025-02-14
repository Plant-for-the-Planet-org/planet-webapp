import type {
  DistinctSpecies,
  PlantLocation,
  PlantLocationDetailsApiResponse,
  PlantLocations,
  Feature,
  FeatureCollection,
  SinglePlantLocationApiResponse,
} from '../../../../../common/types/dataExplorer';
import type { ProjectType } from '../ProjectTypeSelector';
import type { ChangeEvent, MutableRefObject } from 'react';
import type { ViewportProps } from 'react-map-gl';

import { useContext, useEffect, useRef, useState } from 'react';
import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Search } from '@mui/icons-material';
import moment from 'moment';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
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
import { ErrorHandlingContext } from '../../../../../common/Layout/ErrorHandlingContext';
import PlantLocationDetails from './components/PlantLocationDetails';
import MapCredit from './components/MapCredit';
import { useDebouncedEffect } from '../../../../../../utils/useDebouncedEffect';

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
  const { setErrors } = useContext(ErrorHandlingContext);
  const t = useTranslations('TreemapperAnalytics');

  const mapRef: MutableRefObject<null> = useRef(null);
  const [mapState, setMapState] = useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 25,
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
  const [plantLocations, setPlantLocations] = useState<PlantLocations | null>(
    null
  );
  const [plantLocationDetails, setPlantLocationDetails] = useState<
    PlantLocationDetailsApiResponse['res'] | null
  >(null);
  const [selectedLayer, setSelectedLayer] = useState<
    PlantLocation['properties'] | null
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

  // Custom hook for making requests to fetch plant locations
  const { makeRequest: makeReqToFetchPlantLocation } = useNextRequest<{
    data: SinglePlantLocationApiResponse[];
  }>({
    url: `/api/data-explorer/map/plant-location`,
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

  // Custom hook for making requests to fetch plant location details
  const { makeRequest: makeReqToFetchPlantLocationDetails } =
    useNextRequest<PlantLocationDetailsApiResponse>({
      url: `/api/data-explorer/map/plant-location/${selectedLayer?.guid}`,
      method: HTTP_METHOD.GET,
    });

  const fetchProjectLocationsDetails = async () => {
    if (selectedLayer) {
      setLoading(true);
      const { res } =
        (await makeReqToFetchPlantLocationDetails()) as PlantLocationDetailsApiResponse;
      setPlantLocationDetails(res);
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

  // Progamatically navigate to another location on the map
  const _setViewport = (feature: Feature | PlantLocation, zoom = 16) => {
    let centeroid;

    if (feature.geometry === null) {
      centeroid = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: defaultMapCenter,
        },
      };
      zoom = 0;
    } else {
      centeroid = turf.center(feature);
    }

    if (centeroid?.geometry) {
      const [longitude, latitude] = centeroid.geometry.coordinates;
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
    const res = await makeReqToFetchPlantLocation();
    if (res) {
      if (res.data.length === 0) {
        setPlantLocationDetails(null);
      }

      const _plantLocations: PlantLocation[] = res.data.map((pl) => {
        // Calculate the area based on the feature's coordinates using Turf.js
        const area = turf.area(pl.geometry);
        const treeCount = pl.properties.treeCount;
        const density = treeCount / area;

        // Add the calculated density to the feature properties
        return {
          geometry: pl.geometry,
          type: pl.type,
          properties: {
            ...pl.properties,
            density: density,
            opacity: getPolygonOpacity(density),
          },
        };
      });

      const _featureCollection = {
        type: 'FeatureCollection',
        features: _plantLocations,
      };
      setPlantLocations(_featureCollection as PlantLocations);
      if (_plantLocations.length > 0) {
        const defaultFeature = _plantLocations[0];
        _setViewport(defaultFeature);
        setSelectedLayer(
          _plantLocations[0] ? _plantLocations[0].properties : null
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

  // Handle search input change
  // This will be used to filter the plant locations on the map based on the search input
  // The search input can be either a HID or a Date
  // If the input is a HID, the plant location with the matching HID will be selected
  // If the input is a Date, the plant locations with the matching Date will be selected
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement> | React.ClipboardEvent
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
  // If not presnet then it will casue a weird behavior of map where will not
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
        {plantLocations && projectSites ? (
          <>
            <MapGL
              ref={mapRef}
              {...mapState}
              {...viewport}
              onViewStateChange={_handleViewport}
              onViewportChange={(viewport) => setViewport(viewport)}
              onClick={handleMapClick}
            >
              <Source type="geojson" data={plantLocations}>
                <Layer
                  id={`point-layer`}
                  type="circle"
                  paint={{
                    'circle-color': '#007A49',
                    'circle-opacity': 0.5,
                  }}
                  filter={['==', ['geometry-type'], 'Point']}
                />
                <Layer
                  id="plant-locations-fill"
                  type="fill"
                  paint={{
                    'fill-color': '#007A49',
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
                      '#007A49',
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
                    'line-color': '#007A49',
                    'line-width': 4,
                  }}
                />
              </Source>
              <div className={styles.navigationControlContainer}>
                <NavigationControl showCompass={false} />
              </div>
              {selectedLayer && (
                <PlantLocationDetails
                  selectedLayer={selectedLayer}
                  plantLocationDetails={plantLocationDetails}
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
