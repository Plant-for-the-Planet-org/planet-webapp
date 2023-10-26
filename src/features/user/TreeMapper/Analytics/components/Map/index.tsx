import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Container } from '../Container';
import ProjectTypeSelector, { ProjectType } from '../ProjectTypeSelector';
import useNextRequest, {
  HTTP_METHOD,
} from '../../../../../../hooks/use-next-request';
import {
  DistinctSpecies,
  PlantLocation,
  Site,
  Sites,
} from '../../../../../common/types/dataExplorer';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import LeftElements from './components/LeftElements';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Search } from '@mui/icons-material';
import moment from 'moment';
import SitesSelectorAutocomplete from './components/SiteSelectorAutocomplete';
import { MuiAutoComplete } from '../../../../../common/InputTypes/MuiAutoComplete';
import 'mapbox-gl/dist/mapbox-gl.css';

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

  const [_projectType, setProjectType] = useState<ProjectType | null>(null);
  const [distinctSpeciesList, setDistinctSpeciesList] =
    useState<DistinctSpecies>([]);
  const [species, setSpecies] = useState<string | null>(null);
  const [projectSites, setProjectSites] = useState<Sites | null>(null);
  const [projectSite, setProjectSite] = useState<Site | null>(null);
  const [plantLocations, setPlantLocations] = useState<PlantLocation[] | null>(
    null
  );
  const [_plantLocation, setPlantLocation] = useState<PlantLocation | null>(
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

  const [selectedLayer, setSelectedLayer] = useState<PlantLocation | null>(
    null
  );

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
    data: Sites;
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
      setProjectSite(res.data.features[0] ? res.data.features[0] : null);
    }
  };

  const fetchProjectLocations = async () => {
    const res = await makeReqToFetchPlantLocation();
    if (res) {
      setPlantLocations(res.data);
      setPlantLocation(res.data[0] ? res.data[0] : null);
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

  const handleMapClick = (event) => {
    const clickedFeatures = event.features;
    if (clickedFeatures.length > 0) {
      const clickedLayer = clickedFeatures[0];
      setSelectedLayer(clickedLayer);
    }
  };

  const layers = useMemo(() => {
    return plantLocations ? (
      plantLocations.map((pl) => (
        <Source
          key={`${pl.properties.guid}-source`}
          type="geojson"
          data={pl}
          id={pl.properties.guid}
        >
          <Layer
            id={`${pl.properties.guid}-layer`}
            type="fill"
            paint={{
              'fill-color': 'green',
              'fill-opacity': 0.6,
            }}
          />
          {selectedLayer &&
            selectedLayer.properties.guid === pl.properties.guid && (
              <Layer
                key={`${pl.properties.guid}-selected`}
                id={`${pl.properties.guid}-selected-layer`}
                type="line"
                source={pl.properties.guid}
                paint={{
                  'line-color': '#007A49',
                  'line-width': 4,
                }}
              />
            )}
        </Source>
      ))
    ) : (
      <></>
    );
  }, [plantLocations, selectedLayer]);

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
      <div className={styles.mapContainer}>
        {plantLocations && projectSites ? (
          <MapGL
            ref={mapRef}
            {...mapState}
            {...viewport}
            onViewStateChange={_handleViewport}
            onClick={handleMapClick}
          >
            {layers}
            <Source type="geojson" data={projectSites}>
              <Layer
                type="line" // Use "line" to display polygon borders
                paint={{
                  'line-color': '#007A49',
                  'line-width': 4,
                }}
              />
            </Source>
            <div className={styles.navigationControlContainer}>
              <NavigationControl showCompass={false} />
            </div>
          </MapGL>
        ) : (
          <>Loading...</>
        )}
      </div>
    </Container>
  ) : (
    <></>
  );
};
