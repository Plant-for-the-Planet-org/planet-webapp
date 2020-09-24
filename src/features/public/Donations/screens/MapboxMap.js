import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import React, { useRef, useState } from 'react';
import MapGL, {
  FlyToInterpolator,
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
  WebMercatorViewport,
} from 'react-map-gl';
import CancelIcon from '../../../../assets/images/icons/CancelIcon';
import ExploreIcon from '../../../../assets/images/icons/ExploreIcon';
import Switch from '../../../common/InputTypes/ToggleSwitch';
import PopupProject from '../components/PopupProject';
import styles from '../styles/MapboxMap.module.scss';

export default function MapboxMap(props) {
  var timer;
  const projects = props.projects;
  const project = props.project;
  const mapRef = useRef(null);
  const [popupData, setPopupData] = useState({ show: false });
  const [open, setOpen] = React.useState(false);
  const [siteExists, setsiteExists] = React.useState(false);
  const defaultMapCenter = [36.96, -28.5];
  const [singleProjectLatLong, setSingleProjectLatLong] = React.useState([
    defaultMapCenter[0],
    defaultMapCenter[1],
  ]);
  const [geojson, setGeojson] = React.useState({});
  const [maxSites, setMaxSites] = React.useState();
  const [currentSite, setCurrentSite] = React.useState();

  const [mapState, setMapState] = useState({
    mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
  });

  const [viewport, setViewPort] = useState({
    width: '100%',
    height: '100%',
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: 1.4,
  });

  const [exploreExpanded, setExploreExpanded] = React.useState(false);

  const [exploreForests, setExploreForests] = React.useState(false);

  const [explorePotential, setExplorePotential] = React.useState(false);

  const [exploreDeforestation, setExploreDeforestation] = React.useState(false);

  const [explorePlanted, setExplorePlanted] = React.useState(false);

  const [exploreProjects, setExploreProjects] = React.useState(true);

  const handleExploreForestsChange = (event) => {
    setExploreForests(event.target.checked);
  };

  const handleExplorePotentialChange = (event) => {
    setExplorePotential(event.target.checked);
  };
  const handleExploreDeforestationChange = (event) => {
    setExploreDeforestation(event.target.checked);
  };
  const handleExplorePlantedChange = (event) => {
    setExplorePlanted(event.target.checked);
  };
  const handleExploreProjectsChange = (event) => {
    setExploreProjects(event.target.checked);
    props.setShowProjects(event.target.checked);
    if (!event.target.checked) {
      const newViewport = {
        ...viewport,
        latitude: 36.96,
        longitude: 0,
        zoom: 1.4,
        transitionDuration: 2400,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setViewPort(newViewport);
    } else {
      const newViewport = {
        ...viewport,
        latitude: defaultMapCenter[0],
        longitude: defaultMapCenter[1],
        zoom: 1.4,
        transitionDuration: 2400,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setViewPort(newViewport);
    }
  };

  React.useEffect(() => {
    if (props.showSingleProject) {
      setSingleProjectLatLong([
        project.coordinates.lat,
        project.coordinates.lon,
      ]);

      const newGeojson = {
        type: 'FeatureCollection',
        features: project.sites,
      };

      setGeojson({
        type: 'FeatureCollection',
        features: project.sites,
      });

      if (
        typeof newGeojson.features !== 'undefined' &&
        newGeojson.features.length > 0
      ) {
        if (newGeojson.features[0].geometry !== null) {
          setsiteExists(true);
          setCurrentSite(0);
          setMaxSites(newGeojson.features.length);
        } else {
          setsiteExists(false);
        }
      } else {
        setsiteExists(false);
      }
    } else {
      if (project !== null) {
        const newMapState = {
          mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
        };
        const newViewport = {
          ...viewport,
          latitude: defaultMapCenter[0],
          longitude: defaultMapCenter[1],
          zoom: 1.4,
          transitionDuration: 2400,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };
        setMapState(newMapState);
        setViewPort(newViewport);
      }
    }
  }, [project, props.showSingleProject]);

  React.useEffect(() => {
    if (props.showSingleProject) {
      if (siteExists) {
        var bbox = turf.bbox(geojson.features[currentSite]);
        bbox = [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ];
        const { longitude, latitude, zoom } = new WebMercatorViewport(
          viewport
        ).fitBounds(bbox, {
          padding: 100,
        });
        const newMapState = {
          mapStyle: 'mapbox://styles/mapbox/satellite-v9',
        };
        const newViewport = {
          ...viewport,
          longitude,
          latitude,
          zoom,
          transitionDuration: 4000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };
        setViewPort(newViewport);
        setTimeout(() => {
          setMapState(newMapState);
        }, [3800]);
      } else {
        const newMapState = {
          mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
        };
        const newViewport = {
          ...viewport,
          longitude: singleProjectLatLong[1],
          latitude: singleProjectLatLong[0],
          zoom: 13,
          transitionDuration: 4000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };

        setViewPort(newViewport);
        setMapState(newMapState);
      }
    }
  }, [project, siteExists, geojson]);

  React.useEffect(() => {
    if (props.showSingleProject && siteExists) {
      if (currentSite < maxSites) {
        var bbox = turf.bbox(geojson.features[currentSite]);
        bbox = [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ];
        const { longitude, latitude, zoom } = new WebMercatorViewport(
          viewport
        ).fitBounds(bbox, {
          padding: 100,
        });
        const newMapState = {
          mapStyle: 'mapbox://styles/mapbox/satellite-v9',
        };
        const newViewport = {
          ...viewport,
          longitude,
          latitude,
          zoom,
          transitionDuration: 2400,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };
        setViewPort(newViewport);
        setTimeout(() => {
          setMapState(newMapState);
        }, [2300]);
      }
    }
  }, [currentSite]);

  const _onStateChange = (state) => setMapState({ ...state });

  const _onViewportChange = (view) => setViewPort({ ...view });

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  function goToNextProject() {
    if (currentSite < maxSites - 1) {
      setCurrentSite(currentSite + 1);
    } else {
      setCurrentSite(0);
    }
  }

  function goToPrevProject() {
    if (currentSite > 0) {
      setCurrentSite(currentSite - 1);
    } else {
      setCurrentSite(maxSites - 1);
    }
  }

  const handleOpenProject = async (id) => {
    await props.fetchSingleProject(id);
    props.setShowSingleProject(true);
  };

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        mapboxApiAccessToken={props.mapboxToken}
        mapOptions={{
          customAttribution:
            '<a href="https://plant-for-the-planet.org/en/footermenu/privacy-policy">Privacy & Terms</a> <a href="https://plant-for-the-planet.org/en/footermenu/imprint">Imprint</a> <a href="mailto:support@plant-for-the-planet.org">Contact</a>',
        }}
        onViewportChange={_onViewportChange}
        onStateChange={_onStateChange}
        scrollZoom={false}
        onClick={() => setPopupData({ ...popupData, show: false })}
      >
        {props.showSingleProject ? (
          !siteExists ? (
            <Marker
              latitude={singleProjectLatLong[0]}
              longitude={singleProjectLatLong[1]}
              offsetLeft={5}
              offsetTop={-16}
              style={{ left: '28px' }}
            >
              <div className={styles.marker}></div>
            </Marker>
          ) : (
            <Source id="singleProject" type="geojson" data={geojson}>
              <Layer
                id="ploygonLayer"
                type="fill"
                source="singleProject"
                paint={{
                  'fill-color': '#fff',
                  'fill-opacity': 0.2,
                }}
              />
              <Layer
                id="ploygonOutline"
                type="line"
                source="singleProject"
                paint={{
                  'line-color': '#89b54a',
                  'line-width': 2,
                }}
              />
            </Source>
          )
        ) : null}
        {!props.showSingleProject &&
          exploreProjects &&
          projects.map((project, index) => (
            <Marker
              key={index}
              latitude={project.geometry.coordinates[1]}
              longitude={project.geometry.coordinates[0]}
              offsetLeft={5}
              offsetTop={-16}
              style={{ left: '28px' }}
            >
              <div
                className={styles.marker}
                onClick={() =>
                  handleOpenProject(popupData.project.properties.id)
                }
                onMouseOver={(e) => {
                  timer = setTimeout(function () {
                    setPopupData({
                      show: true,
                      lat: project.geometry.coordinates[1],
                      long: project.geometry.coordinates[0],
                      project: project,
                    });
                  }, 300);
                }}
                onMouseLeave={(e) => {
                  clearTimeout(timer);
                }}
              >
                {/* <img
                src="https://cdn-app.plant-for-the-planet.org/media/maps/pet_p.svg"
                className={styles.markerType}
              /> */}
              </div>
            </Marker>
          ))}
        {popupData.show && (
          <Popup
            latitude={popupData.lat}
            longitude={popupData.long}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setPopupData({ ...popupData, show: false })}
            anchor="bottom"
            dynamicPosition={false}
            offsetTop={-15}
            tipSize={0}
          >
            <div
              className={styles.popupProject}
              onClick={() => handleOpenProject(popupData.project.properties.id)}
              onMouseLeave={(e) => {
                if (!open) {
                  setTimeout(function () {
                    setPopupData({ ...popupData, show: false });
                  }, 300);
                  handleClose();
                }
              }}
            >
              <PopupProject
                key={popupData.project.properties.id}
                project={popupData.project}
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
              />
            </div>
          </Popup>
        )}
        {exploreForests ? (
          <Source
            id="forests"
            type="raster"
            tiles={[
              'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Forest_Denisty_V2/MapServer/tile/{z}/{y}/{x}',
            ]}
            tileSize={128}
          >
            <Layer id="forest-layer" source="forests" type="raster" />
          </Source>
        ) : null}

        {explorePotential ? (
          <Source
            id="potential"
            type="raster"
            tiles={[
              ' https://earthengine.googleapis.com/map/80c988d5e8f6021ef9e6d2447f405c79/{z}/{x}/{y}?token=75974606a47356f360a3c7783b54369c',
            ]}
            tileSize={128}
          >
            <Layer id="forest-layer" source="potential" type="raster" />
          </Source>
        ) : null}

        {exploreDeforestation ? (
          <Source
            id="deforestation"
            type="raster"
            tiles={[
              'https://earthengine.google.org/static/hansen_2013/gain_alpha/{z}/{x}/{y}.png',
            ]}
            tileSize={128}
          >
            <Layer id="forest-layer" source="deforestation" type="raster" />
          </Source>
        ) : null}
        <div className={styles.mapNavigation}>
          <NavigationControl showCompass={false} />
        </div>
        <div>
          <div
            className={styles.exploreButton}
            onClick={() => {
              if (exploreExpanded) {
                setExploreExpanded(false);
              } else {
                setExploreExpanded(true);
              }
            }}
          >
            {exploreExpanded ? <CancelIcon /> : <ExploreIcon />}
            {exploreExpanded ? null : (
              <p
                onClick={() => setExploreExpanded(true)}
                className={styles.exploreText}
              >
                Explore
              </p>
            )}
          </div>
          {exploreExpanded ? (
            <div className={styles.exploreExpanded}>
              <div>
                <FormGroup>
                  <div className={styles.exploreToggleRow}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={exploreForests}
                          onChange={handleExploreForestsChange}
                          name="forest"
                        />
                      }
                      label="Forest"
                    />
                  </div>
                  <div className={styles.exploreToggleRow}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={explorePotential}
                          onChange={handleExplorePotentialChange}
                          name="potential"
                        />
                      }
                      label="Reforestation Potential"
                    />
                    {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                  </div>

                  <div className={styles.exploreToggleRow}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={exploreDeforestation}
                          onChange={handleExploreDeforestationChange}
                          name="deforestation"
                        />
                      }
                      label="Deforestation"
                    />
                  </div>
                  <div className={styles.exploreToggleRow}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={explorePlanted}
                          onChange={handleExplorePlantedChange}
                          name="planted"
                        />
                      }
                      label="Planted Trees"
                    />
                  </div>
                  <div className={styles.exploreToggleRow}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={exploreProjects}
                          onChange={handleExploreProjectsChange}
                          name="projects"
                        />
                      }
                      label="Projects"
                    />
                  </div>
                </FormGroup>
              </div>
              <Divider width="85%" />
              <div className={styles.exploreNote}>
                The world has about 3 trillion trees today ("Forests"). And
                space for up to a trillion more ("Reforestation Protential").
              </div>
            </div>
          ) : null}
        </div>

        {props.showSingleProject && siteExists ? (
          maxSites > 1 ? (
            <div className={styles.projectControls}>
              <ChevronLeftIcon onClick={goToPrevProject} />
              <p className={styles.projectControlText}>
                &nbsp;&nbsp;
                {siteExists &&
                project.sites.length != 0 &&
                geojson.features[currentSite]
                  ? geojson.features[currentSite].properties.name
                  : null}
                &nbsp;&nbsp;
              </p>
              <ChevronRightIcon onClick={goToNextProject} />
            </div>
          ) : null
        ) : null}
      </MapGL>
    </div>
  );
}
