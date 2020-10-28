import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import MapGL, {
  FlyToInterpolator,
  // Layer as Layer1,
  Marker,
  NavigationControl,
  Popup,
  Source,
  WebMercatorViewport,
} from 'react-map-gl';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import ExploreIcon from '../../../../assets/images/icons/ExploreIcon';
import Switch from '../../../common/InputTypes/ToggleSwitch';
import LeftIcon from '../../../../../public/assets/images/icons/LeftIcon';
import RightIcon from '../../../../../public/assets/images/icons/RightIcon';
import PopupProject from './PopupProject';
import styles from '../styles/MapboxMap.module.scss';

interface mapProps {
  projects: any;
  project: any;
  showSingleProject: Boolean;
  mapboxToken: any;
  setShowProjects: Function;
}
export default function MapboxMap({
  projects,
  project,
  showSingleProject,
  mapboxToken,
  setShowProjects,
}: mapProps) {
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout;
  const router = useRouter();
  const mapRef = useRef(null);
  const parentRef = useRef(null);
  const exploreContainerRef = useRef(null);
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 767;
  const [popupData, setPopupData] = useState({ show: false });
  const [open, setOpen] = React.useState(false);
  const [siteExists, setsiteExists] = React.useState(false);
  const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
  const defaultZoom = isMobile ? 1 : 1.4;
  const [singleProjectLatLong, setSingleProjectLatLong] = React.useState([
    defaultMapCenter[0],
    defaultMapCenter[1],
  ]);
  const [geoJson, setGeoJson] = React.useState(null);
  const [maxSites, setMaxSites] = React.useState();
  const [currentSite, setCurrentSite] = React.useState<null | Number>();
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const [mapState, setMapState] = useState({
    mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
  });

  const [viewport, setViewPort] = useState({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const activeLayers = [
    {
      id: 'gain',
      name: 'Tree cover gain',
      config: {
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [
            'https://earthengine.google.org/static/hansen_2013/gain_alpha/{z}/{x}/{y}.png',
          ],
          minzoom: 3,
          maxzoom: 12,
        },
      },
      legendConfig: {
        type: 'basic',
        items: [
          {
            name: 'Tree cover gain',
            color: '#6D6DE5',
          },
        ],
      },
    },
    {
      id: 'loss',
      name: 'Tree cover loss',
      config: {
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [
            'https://storage.googleapis.com/wri-public/Hansen_16/tiles/hansen_world/v1/tc30/{z}/{x}/{y}.png',
          ],
          minzoom: 3,
          maxzoom: 12,
        },
      },
      legendConfig: {
        enabled: true,
      },
      decodeConfig: [
        {
          default: '2001-01-01',
          key: 'startDate',
          required: true,
        },
        {
          default: '2018-12-31',
          key: 'endDate',
          required: true,
        },
      ],
      timelineConfig: {
        step: 1,
        speed: 250,
        interval: 'years',
        dateFormat: 'YYYY',
        trimEndDate: '2018-12-31',
        maxDate: '2018-12-31',
        minDate: '2001-01-01',
        canPlay: true,
        railStyle: {
          background: '#DDD',
        },
        trackStyle: [
          {
            background: '#dc6c9a',
          },
          {
            background: '#982d5f',
          },
        ],
      },
      decodeFunction:
        '\n      // values for creating power scale, domain (input), and range (output)\n      float domainMin = 0.;\n      float domainMax = 255.;\n      float rangeMin = 0.;\n      float rangeMax = 255.;\n\n      float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;\n      float intensity = color.r * 255.;\n\n      // get the min, max, and current values on the power scale\n      float minPow = pow(domainMin, exponent - domainMin);\n      float maxPow = pow(domainMax, exponent);\n      float currentPow = pow(intensity, exponent);\n\n      // get intensity value mapped to range\n      float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;\n      // a value between 0 and 255\n      alpha = zoom < 13. ? scaleIntensity / 255. : color.g;\n\n      float year = 2000.0 + (color.b * 255.);\n      // map to years\n      if (year >= startYear && year <= endYear && year >= 2001.) {\n        color.r = 220. / 255.;\n        color.g = (72. - zoom + 102. - 3. * scaleIntensity / zoom) / 255.;\n        color.b = (33. - zoom + 153. - intensity / zoom) / 255.;\n      } else {\n        alpha = 0.;\n      }\n    ',
    },
    {
      id: 'protected-areas',
      name: 'Protected areas',
      config: {
        type: 'vector',
        source: {
          type: 'vector',
          promoteId: 'cartodb_id',
          provider: {
            type: 'carto',
            account: 'wri-01',
            layers: [
              {
                options: {
                  cartocss:
                    '#wdpa_protected_areas {  polygon-opacity: 1.0; polygon-fill: #704489 }',
                  cartocss_version: '2.3.0',
                  sql: 'SELECT * FROM wdpa_protected_areas',
                },
                type: 'mapnik',
              },
            ],
          },
        },
        render: {
          layers: [
            {
              type: 'fill',
              'source-layer': 'layer0',
              featureState: {},
              paint: {
                'fill-color': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  '#000',
                  '#5ca2d1',
                ],
                'fill-color-transition': {
                  duration: 300,
                  delay: 0,
                },
                'fill-opacity': 1,
              },
            },
            {
              type: 'line',
              'source-layer': 'layer0',
              paint: {
                'line-color': '#000000',
                'line-opacity': 0.1,
              },
            },
          ],
        },
      },
      paramsConfig: [],
      legendConfig: {
        type: 'basic',
        items: [
          {
            name: 'Protected areas',
            color: '#5ca2d1',
          },
        ],
      },
      interactionConfig: {
        enabled: true,
        type: 'hover',
      },
    },
    {
      id: 'mongabay-stories',
      name: 'Mongabay stories',
      config: {
        type: 'geojson',
        images: [
          {
            id: 'lm-marker1',
            src: '/layer-manager/static/media/marker1.ff16441f.svg',
            options: {
              sdf: true,
            },
          },
          {
            id: 'lm-marker2',
            src: '/layer-manager/static/media/marker2.c4f943ea.svg',
            options: {
              sdf: true,
            },
          },
        ],
        source: {
          type: 'geojson',
          promoteId: 'cartodb_id',
          data:
            'https://wri-01.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20mongabay&format=geojson',
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 45,
        },
        render: {
          metadata: {
            position: 'top',
          },
          layers: [
            {
              id: 'media-clusters',
              metadata: {
                position: 'top',
              },
              type: 'circle',
              filter: ['has', 'point_count'],
              paint: {
                'circle-color': '#FFF',
                'circle-stroke-width': 2,
                'circle-stroke-color': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  '#000',
                  '#5ca2d1',
                ],
                'circle-radius': 12,
              },
            },
            {
              id: 'media-cluster-count',
              metadata: {
                position: 'top',
              },
              type: 'symbol',
              filter: ['has', 'point_count'],
              layout: {
                'text-allow-overlap': true,
                'text-ignore-placement': true,
                'text-field': '{point_count_abbreviated}',
                'text-size': 12,
              },
            },
            {
              id: 'media',
              metadata: {
                position: 'top',
              },
              type: 'symbol',
              filter: ['!', ['has', 'point_count']],
              paint: {
                'icon-color': '#F00',
              },
              layout: {
                'icon-ignore-placement': true,
                'icon-allow-overlap': true,
                'icon-image': 'lm-marker1',
              },
            },
          ],
        },
      },
      paramsConfig: [],
      legendConfig: {
        type: 'basic',
        items: [
          {
            name: 'Mongabay stories',
            color: '#FFCC00',
          },
        ],
      },
      interactionConfig: {
        enabled: true,
        type: 'hover',
      },
    },
  ];

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
    setShowProjects(event.target.checked);
    if (!event.target.checked) {
      const newViewport = {
        ...viewport,
        latitude: 36.96,
        longitude: 0,
        zoom: 1.4,
        transitionDuration: 1200,
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
        transitionDuration: 1200,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setViewPort(newViewport);
    }
  };

  React.useEffect(() => {
    if (showSingleProject) {
      if (project !== null) {
        setSingleProjectLatLong([
          project.coordinates.lat,
          project.coordinates.lon,
        ]);
        if (typeof project.sites !== 'undefined' && project.sites.length > 0) {
          if (project.sites[0].geometry !== null) {
            setCurrentSite(0);
            setMaxSites(project.sites.length);
            setGeoJson({
              type: 'FeatureCollection',
              features: project.sites,
            });
            setTimeout(() => {
              setsiteExists(true);
            }, 300);
          } else {
            setsiteExists(false);
            setGeoJson(null);
            setSingleProjectLatLong([
              project.coordinates.lat,
              project.coordinates.lon,
            ]);
          }
        } else {
          setsiteExists(false);
          setGeoJson(null);
          setSingleProjectLatLong([
            project.coordinates.lat,
            project.coordinates.lon,
          ]);
        }
      }
    } else {
    }
  }, [showSingleProject, project]);

  React.useEffect(() => {
    if (showSingleProject) {
      if (project) {
        if (siteExists) {
          if (geoJson !== null) {
            const bbox = turf.bbox(geoJson.features[currentSite]);
            const { longitude, latitude, zoom } = new WebMercatorViewport(
              viewport
            ).fitBounds(
              [
                [bbox[0], bbox[1]],
                [bbox[2], bbox[3]],
              ],
              {
                padding: {
                  top: 50,
                  bottom: isMobile ? 120 : 50,
                  left: isMobile ? 50 : 400,
                  right: isMobile ? 50 : 100,
                },
              }
            );
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
            setMapState(newMapState);
          }
        } else {
          const newMapState = {
            mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
          };
          const newViewport = {
            ...viewport,
            longitude: singleProjectLatLong[1],
            latitude: singleProjectLatLong[0],
            zoom: 5,
            transitionDuration: 4000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic,
          };
          setViewPort(newViewport);
          setMapState(newMapState);
        }
      } else {
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
  }, [
    project,
    showSingleProject,
    siteExists,
    geoJson,
    currentSite,
    singleProjectLatLong,
  ]);

  React.useEffect(() => {
    document.addEventListener(
      'mousedown',
      (event) => {
        if (exploreExpanded) {
          if (
            exploreContainerRef &&
            !exploreContainerRef.current.contains(event.target)
          ) {
            setExploreExpanded(false);
          }
        }
      },
      false
    );
  });

  const _onStateChange = (state: any) => setMapState({ ...state });

  const _onViewportChange = (view: any) => setViewPort({ ...view });

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

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        mapboxApiAccessToken={mapboxToken}
        mapOptions={{
          customAttribution:
            '<a href="https://plant-for-the-planet.org/en/footermenu/privacy-policy">Privacy & Terms</a> <a href="https://plant-for-the-planet.org/en/footermenu/imprint">Imprint</a> <a href="mailto:support@plant-for-the-planet.org">Contact</a>',
        }}
        // onLoad={() => setLoaded(true)}
        onViewportChange={_onViewportChange}
        onStateChange={_onStateChange}
        scrollZoom={false}
        onClick={() => setPopupData({ ...popupData, show: false })}
      >
        {showSingleProject ? (
          !siteExists ? (
            <Marker
              latitude={singleProjectLatLong[0]}
              longitude={singleProjectLatLong[1]}
              offsetLeft={5}
              offsetTop={-16}
              style={{ left: '28px' }}
            >
              <div className={styles.marker} />
            </Marker>
          ) : (
            // <Source id="singleProject" type="geojson" data={geoJson}>
            //   <Layer1
            //     id="ploygonLayer"
            //     type="fill"
            //     source="singleProject"
            //     paint={{
            //       'fill-color': '#fff',
            //       'fill-opacity': 0.2,
            //     }}
            //   />
            //   <Layer1
            //     id="ploygonOutline"
            //     type="line"
            //     source="singleProject"
            //     paint={{
            //       'line-color': '#89b54a',
            //       'line-width': 2,
            //     }}
            //   />
            // </Source>
            <></>
          )
        ) : null}

        {!showSingleProject &&
          exploreProjects &&
          projects.map((projectMarker: any, index: any) => (
            <Marker
              key={index}
              latitude={projectMarker.geometry.coordinates[1]}
              longitude={projectMarker.geometry.coordinates[0]}
              offsetLeft={5}
              offsetTop={-16}
              style={{ left: '28px' }}
            >
              <div
                className={styles.marker}
                onClick={() =>
                  router.push('/[p]', `/${projectMarker.properties.slug}`, {
                    shallow: true,
                  })
                }
                onKeyPress={() =>
                  router.push('/[p]', `/${projectMarker.properties.slug}`, {
                    shallow: true,
                  })
                }
                role="button"
                tabIndex={0}
                onMouseOver={() => {
                  timer = setTimeout(() => {
                    setPopupData({
                      show: true,
                      lat: projectMarker.geometry.coordinates[1],
                      long: projectMarker.geometry.coordinates[0],
                      project: projectMarker,
                    });
                  }, 300);
                }}
                onMouseLeave={() => {
                  clearTimeout(timer);
                }}
                onFocus={() => {}}
              >
                {/* <img
                src="https://cdn-app.plant-for-the-planet.org/media/maps/pet_p.svg"
                className={styles.markerType}
              /> */}
              </div>
            </Marker>
          ))}
        {popupData.show && !isMobile && (
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
              onClick={(event) => {
                if (event.target !== buttonRef.current) {
                  if (popupRef.current === null) {
                    router.push(
                      '/[p]',
                      `/${popupData.project.properties.slug}`,
                      {
                        shallow: true,
                      }
                    );
                  } else if (!popupRef.current.contains(event.target)) {
                    router.push(
                      '/[p]',
                      `/${popupData.project.properties.slug}`,
                      {
                        shallow: true,
                      }
                    );
                  }
                }
              }}
              onKeyPress={() =>
                router.push('/[p]', `/${popupData.project.properties.slug}`, {
                  shallow: true,
                })
              }
              role="button"
              tabIndex={0}
              onMouseLeave={() => {
                if (!open) {
                  setTimeout(() => {
                    setPopupData({ ...popupData, show: false });
                  }, 300);
                  handleClose();
                }
              }}
            >
              <PopupProject
                key={popupData.project.properties.id}
                project={popupData.project}
                buttonRef={buttonRef}
                popupRef={popupRef}
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
            {/* <Layer1 id="forest-layer" source="forests" type="raster" /> */}
          </Source>
        ) : null}

        {explorePotential ? (
          <Source
            id="potential"
            type="raster"
            tiles={[
              ' https://earthengine.googleapis.com/map/80c988d5e8f6021ef9e6d2447f405c79/{z}/{x}/{y}?token=a5a5893006a0ea587845708b078df9ca',
            ]}
            tileSize={128}
          >
            {/* <Layer1 id="potential-layer" source="potential" type="raster" /> */}
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
            {/* <Layer1
              id="deforestation-layer"
              source="deforestation"
              type="raster"
            /> */}
          </Source>
        ) : null}

        {/* {loaded && mapRef.current && (
          <LayerManager map={mapRef.current.getMap()} plugin={PluginMapboxGl}>
            {activeLayers.map((l) => (
              <Layer key={l.id} {...l} />
            ))}
          </LayerManager>
        )} */}

        <div className={styles.mapNavigation}>
          <NavigationControl showCompass={false} />
        </div>
        <div ref={exploreContainerRef}>
          <div
            className={styles.exploreButton}
            onClick={() => {
              if (exploreExpanded) {
                setExploreExpanded(false);
              } else {
                setExploreExpanded(true);
              }
            }}
            style={
              exploreExpanded
                ? {
                    padding: '4px 10px',
                  }
                : {}
            }
          >
            {exploreExpanded ? <CancelIcon /> : <ExploreIcon />}
            {exploreExpanded ? null : (
              <p
                onClick={() => setExploreExpanded(true)}
                className={styles.exploreText}
              >
                {isMobile ? null : 'Explore'}
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
                  {/* <div className={styles.exploreToggleRow}>
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
                  </div> */}
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
            </div>
          ) : null}
        </div>

        {showSingleProject && siteExists ? (
          maxSites! > 1 ? (
            <div className={styles.projectControls}>
              <div
                onClick={goToPrevProject}
                onKeyPress={goToPrevProject}
                role="button"
                tabIndex={0}
              >
                <LeftIcon />
              </div>

              <p className={styles.projectControlText}>
                &nbsp;&nbsp;
                {project !== null &&
                siteExists &&
                project.sites.length !== 0 &&
                geoJson.features[currentSite]
                  ? geoJson.features[currentSite].properties.name
                  : null}
                &nbsp;&nbsp;
              </p>
              <div
                onClick={goToNextProject}
                onKeyPress={goToNextProject}
                role="button"
                tabIndex={0}
              >
                <RightIcon />
              </div>
            </div>
          ) : null
        ) : null}
      </MapGL>
    </div>
  );
}
