import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Container } from '../Container';
import ProjectTypeSelector, { ProjectType } from '../ProjectTypeSelector';
import useNextRequest, {
  HTTP_METHOD,
} from '../../../../../../hooks/use-next-request';
import {
  DistinctSpecies,
  PlantLocation,
  Site,
} from '../../../../../common/types/dataExplorer';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import LeftElements from './components/LeftElements';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Search } from '@mui/icons-material';
import moment from 'moment';
import SitesSelectorAutocomplete from './components/SiteSelectorAutocomplete';
import { MuiAutoComplete } from '../../../../../common/InputTypes/MuiAutoComplete';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS
// import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'; // Import the geocoder CSS
// import 'react-map-gl/dist/react-map-gl.css'; // Import react-map-gl CSS

import styles from './index.module.scss';
import getMapStyle from '../../../../../../utils/maps/getMapStyle';
import MapGL, {
  Layer,
  NavigationControl,
  Source,
  ViewportProps,
} from 'react-map-gl';

const EMPTY_STYLE = {
  version: 8,
  sources: {},
  layers: [],
};

const defaultMapCenter = [0, 0];
const defaultZoom = 1.4;

export const MapContainer = () => {
  const { project } = useAnalytics();
  const { t, ready } = useTranslation(['treemapperAnalytics']);

  const [_, setProjectType] = useState<ProjectType | null>(null);
  const [distinctSpeciesList, setDistinctSpeciesList] =
    useState<DistinctSpecies>([]);
  const [species, setSpecies] = useState<string | null>(null);
  const [projectSites, setProjectSites] = useState<Site[]>([]);
  const [projectSite, setProjectSite] = useState<Site | null>(null);
  const [projectLoactions, setProjectLocations] = useState<
    PlantLocation[] | null
  >(null);
  const [projectLocation, setProjectLocation] = useState<PlantLocation | null>(
    null
  );
  const [search, setSearch] = useState<string>('');

  const mapRef: MutableRefObject<null> = useRef(null);
  const [mapState, setMapState] = useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 25,
  });

  const polygonCoordinates = [
    [
      [-2.01902187, 8.21742549, 0],
      [-2.02027415, 8.22640159, 0],
      [-2.02153332, 8.23538887, 0],
      [-2.02313474, 8.24680966, 0],
      [-2.01411534, 8.24786525, 0],
      [-2.0050915, 8.24889428, 0],
      [-1.99593169, 8.24990976, 0],
      [-1.99439009, 8.24097948, 0],
      [-1.99287861, 8.23206785, 0],
      [-1.99135934, 8.22314705, 0],
      [-1.99087965, 8.22041328, 0],
      [-1.99989082, 8.21948676, 0],
      [-2.00897626, 8.21851121, 0],
      [-2.01902187, 8.21742549, 0],
    ],
  ];

  const [viewport, setViewport] = useState<ViewportProps>({
    width: '100%',
    height: '500px',
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const { makeRequest } = useNextRequest<{ data: DistinctSpecies }>({
    url: `/api/data-explorer/map/distinct-species/${project?.id}`,
    method: HTTP_METHOD.GET,
  });

  const { makeRequest: makeReqToFetchProjectSites } = useNextRequest<{
    data: Site[];
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
    },
  });

  useEffect(() => {
    //loads the default mapstyle
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
        console.log('result ==> ', result);
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
      setProjectSite(res.data[0] ? res.data[0] : null);
    }
  };

  const fetchProjectLocations = async () => {
    const res = await makeReqToFetchPlantLocation();
    if (res) {
      setProjectLocations(res.data);
      setProjectLocation(res.data[0] ? res.data[0] : null);

      console.log('res.data ==>', res.data);
    }
  };

  useEffect(() => {
    if (project) {
      fetchDistinctSpecies();
      fetchProjectSites();
    }
  }, [project]);

  useEffect(() => {
    if (project && species) {
      fetchProjectLocations();
    }
  }, [project, species]);

  const handleProjectTypeChange = (projType: ProjectType | null) => {
    setProjectType(projType);
  };

  const handleSiteChange = (site: Site | null) => {
    setProjectSite(site);
  };

  console.log('projectLoactions ==>', projectLoactions);

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
          <TextField
            style={{ minWidth: '150px' }}
            label={t('search')}
            InputProps={{
              startAdornment: <Search />,
            }}
            value={search}
            placeholder={moment().format('YYYY-MM-DD')}
            onChange={(e) => setSearch(e.target.value)}
          />
        </LeftElements>
      }
      rightElement={
        <SitesSelectorAutocomplete
          sitesList={projectSites}
          site={projectSite}
          handleSiteChange={handleSiteChange}
          styles={{ minWidth: '200px' }}
        />
      }
      overrideBodyStyles={styles.body}
    >
      <div style={{ minHeight: '500px' }}>
        <MapGL
          ref={mapRef}
          {...mapState}
          {...viewport}
          onViewStateChange={_handleViewport}
        >
          <Source
            type="geojson"
            data={{
              type: 'Feature',
              properties: {
                guid: 'id_wefqewf',
              },
              geometry: {
                type: 'Polygon',
                coordinates: polygonCoordinates,
              },
            }}
          >
            <Layer
              type="fill"
              paint={{
                'fill-color': 'blue', // Set the polygon fill color
                'fill-opacity': 0.5, // Set the polygon fill opacity
              }}
            />
          </Source>
          <div className={styles.navigationControlContainer}>
            <NavigationControl showCompass={false} />
          </div>
        </MapGL>
      </div>
    </Container>
  ) : (
    <></>
  );
};
