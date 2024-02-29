import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Search } from '@mui/icons-material';
import moment from 'moment';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import MapGL, {
  Layer,
  NavigationControl,
  Source,
  ViewportProps,
} from 'react-map-gl';

import {
  DistinctSpecies,
  PlantLocation,
  PlantLocationDetailsApiResponse,
  PlantLocations,
  Feature,
  FeatureCollection,
} from '../../../../../common/types/dataExplorer';
import { Container } from '../Container';
import ProjectTypeSelector, { ProjectType } from '../ProjectTypeSelector';
import useNextRequest, {
  HTTP_METHOD,
} from '../../../../../../hooks/use-next-request';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import LeftElements from './components/LeftElements';
import SitesSelectorAutocomplete from './components/SiteSelectorAutocomplete';
import { MuiAutoComplete } from '../../../../../common/InputTypes/MuiAutoComplete';
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
  const { t, ready } = useTranslation(['treemapperAnalytics']);

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

  const mapRef: MutableRefObject<null> = useRef(null);
  const [mapState, setMapState] = useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 25,
  });

  const [viewport, setViewport] = useState<ViewportProps>({
    width: '100%',
    height: '500px',
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const [loading, setLoading] = useState(false);

  const { makeRequest } = useNextRequest<{ data: DistinctSpecies }>({
    url: `/api/data-explorer/map/distinct-species/${project?.id}`,
    method: HTTP_METHOD.GET,
  });

  const { makeRequest: makeReqToFetchProjectSites } = useNextRequest<{
    data: FeatureCollection;
  }>({
    url: `/api/data-explorer/map/sites/${project?.id}`,
    method: HTTP_METHOD.GET,
  });

  const { makeRequest: makeReqToFetchPlantLocation } = useNextRequest<{
    data: PlantLocation[];
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

  useEffect(() => {
    setSelectedLayer(null);
  }, [project]);

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

  const _handleViewport = (newViewport: ViewportProps) =>
    setViewport({ ...viewport, ...newViewport });

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

  const _setViewport = (feature: Feature, zoom = 16) => {
    const centeroid = turf.center(feature);
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

  const fetchProjectLocations = async () => {
    setLoading(true);
    const res = await makeReqToFetchPlantLocation();
    if (res) {
      if (res.data.length === 0) {
        setPlantLocationDetails(null);
      }

      const _plantLocations = res.data.map((pl) => {
        // Calculate the area based on the feature's coordinates using Turf.js
        const area = turf.area(pl.geometry);
        const treeCount = pl.properties.treeCount;
        const density = treeCount / area;

        // Add the calculated density to the feature properties
        pl.properties.density = density;
        pl.properties.opacity = getPolygonOpacity(density);

        return pl;
      });
      const _featureCollection = {
        type: 'FeatureCollection',
        features: _plantLocations,
      };
      setPlantLocations(_featureCollection as PlantLocations);
      if (_plantLocations.length > 0) {
        const defaultFeature = _plantLocations[0];
        _setViewport(defaultFeature);
        setSelectedLayer(res.data[0] ? res.data[0].properties : null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (project) {
      fetchDistinctSpecies();
      fetchProjectSites();
    }
  }, [project]);

  useEffect(() => {
    if (project && species) {
      if (queryType === QueryType.DATE) {
        if (!isDateBetween(search, fromDate, toDate)) {
          setErrors([{ message: t('searchDateError') }]);
          return;
        }
      }
      fetchProjectLocations();
    }
  }, [project, species, queryType, fromDate, toDate]);

  const handleProjectTypeChange = (projType: ProjectType | null) => {
    setProjectType(projType);
  };

  const handleSiteChange = (site: Feature | null) => {
    setProjectSite(site);
    if (site) {
      _setViewport(site, 13.5);
    }
  };

  const handleMapClick = async (event) => {
    const clickedFeatures = event.features;
    if (clickedFeatures.length > 0) {
      const clickedLayerProperties = clickedFeatures[0].properties;
      if (Object.keys(clickedLayerProperties).length !== 0) {
        setSelectedLayer(clickedLayerProperties);
      }
    }
  };

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

  return ready ? (
    <Container
      leftElement={
        <LeftElements>
          <ProjectTypeSelector
            handleProjectTypeChange={handleProjectTypeChange}
            styles={{ minWidth: '200px' }}
          />
          <MuiAutoComplete
            style={{ minWidth: '200px' }}
            options={distinctSpeciesList}
            getOptionLabel={(option) => option as string}
            isOptionEqualToValue={(option, value) => option === value}
            value={species}
            onChange={(_event, newValue) =>
              setSpecies(newValue as string | null)
            }
            renderOption={(props, option) => (
              <span {...props} key={option as string}>
                {option}
              </span>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('plantLocationsWithPlantedSpecies')}
                color="primary"
              />
            )}
          />
          <SitesSelectorAutocomplete
            sitesList={projectSites ? projectSites.features : []}
            site={projectSite}
            handleSiteChange={handleSiteChange}
            styles={{ minWidth: '200px' }}
          />
        </LeftElements>
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
          onChange={handleSearchChange}
          onPaste={handleSearchChange}
        />
      }
      overrideBodyStyles={styles.body}
    >
      <div className={styles.mapContainer}>
        {plantLocations && projectSites && selectedLayer ? (
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
        ) : (
          <div className={styles.spinner}></div>
        )}
      </div>
    </Container>
  ) : (
    <></>
  );
};
