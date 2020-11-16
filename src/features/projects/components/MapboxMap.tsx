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
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
  WebMercatorViewport,
} from 'react-map-gl';
import { LayerManager, Layer as LayerM } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import ExploreIcon from '../../../assets/images/icons/ExploreIcon';
import Switch from '../../common/InputTypes/ToggleSwitch';
import LeftIcon from '../../../../public/assets/images/icons/LeftIcon';
import RightIcon from '../../../../public/assets/images/icons/RightIcon';
import PopupProject from './PopupProject';
import { getParams } from '../../../utils/LayerManagerUtils';
import TreeCoverLoss from '../../../../public/data/layers/tree-cover-loss';

import {
  Icons,
  Legend,
  LegendListItem,
  LegendItemTypes,
  LegendItemTimeStep,
  LegendItemToolbar,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
} from 'vizzuality-components';

import styles from '../styles/MapboxMap.module.scss';
import InfoIcon from '../../../../public/assets/images/icons/InfoIcon';
import OpenLink from '../../../../public/assets/images/icons/OpenLink';
import CloseIcon from '../../../../public/assets/images/icons/CloseIcon';
import i18next from '../../../../i18n/';
import { Modal } from '@material-ui/core';

const { useTranslation } = i18next;

interface mapProps {
  projects: any;
  project: any;
  showSingleProject: Boolean;
  mapboxToken: any;
  setShowProjects: Function;
  searchedProject: any;
  showProjects: any;
}
export default function MapboxMap({
  projects,
  project,
  showSingleProject,
  mapboxToken,
  setShowProjects,
  searchedProject,
  showProjects,
}: mapProps) {
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout;
  const router = useRouter();

  const { t, i18n } = useTranslation(['maps']);

  const mapRef = useRef(null);
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
  const [layersSettings, setLayersSettings] = useState({});
  const infoRef = useRef(null);

  const [mapState, setMapState] = useState({
    mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
    dragPan: true,
  });

  const [viewport, setViewPort] = useState({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const [exploreExpanded, setExploreExpanded] = React.useState(false);

  const [exploreForests, setExploreForests] = React.useState(false);

  const [explorePotential, setExplorePotential] = React.useState(false);

  const [exploreDeforestation, setExploreDeforestation] = React.useState(false);

  const [explorePlanted, setExplorePlanted] = React.useState(false);

  const [exploreProjects, setExploreProjects] = React.useState(true);

  const [infoExpanded, setInfoExpanded] = React.useState(null);

  const [openModal, setModalOpen] = React.useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

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
      const newMapState = {
        mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
      };
      const newViewport = {
        ...viewport,
        latitude: defaultMapCenter[0],
        longitude: defaultMapCenter[1],
        zoom: 1.4,
        transitionDuration: 1200,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setMapState(newMapState);
      setViewPort(newViewport);
      router.push('/', undefined, {
        shallow: true,
      });
    }
  };

  React.useEffect(() => {
    if (showSingleProject) {
      if (project) {
        setSingleProjectLatLong([
          project.coordinates.lat,
          project.coordinates.lon,
        ]);
        if (typeof project.sites !== 'undefined' && project.sites.length > 0) {
          if (project.sites[0].geometry) {
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
      setExploreProjects(false);
      setShowProjects(false);
    } else {
      setExploreProjects(true);
      setShowProjects(true);
    }
  }, [showSingleProject, project]);

  React.useEffect(() => {
    if (showSingleProject) {
      if (project) {
        if (siteExists) {
          if (geoJson) {
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
    document.addEventListener('mousedown', (event) => {
      if (exploreExpanded) {
        if (
          exploreContainerRef &&
          !exploreContainerRef.current.contains(event.target)
        ) {
          setExploreExpanded(false);
        }
      }
    });
  });

  React.useEffect(() => {
    if (exploreExpanded) {
      setMapState({ ...mapState, dragPan: false });
    } else {
      setMapState({ ...mapState, dragPan: true });
    }
  }, [exploreExpanded]);

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

  // LEGEND
  const layerLegend = TreeCoverLoss.map((l) => {
    const { id, decodeConfig, timelineConfig } = l;
    const lSettings = layersSettings[id] || {};

    const decodeParams =
      !!decodeConfig &&
      getParams(decodeConfig, { ...timelineConfig, ...lSettings.decodeParams });
    const timelineParams = !!timelineConfig && {
      ...timelineConfig,
      ...getParams(decodeConfig, lSettings.decodeParams),
    };

    return {
      id,
      slug: id,
      dataset: id,
      layers: [
        {
          active: true,
          ...l,
          ...lSettings,
          decodeParams,
          timelineParams,
        },
      ],
      ...lSettings,
    };
  });

  const onChangeLayerDate = (dates, layer) => {
    const { id, decodeConfig } = layer;

    setLayersSettings({
      ...layersSettings,
      [id]: {
        ...layersSettings[id],
        ...(decodeConfig && {
          decodeParams: {
            startDate: dates[0],
            endDate: dates[1],
            trimEndDate: dates[2],
          },
        }),
        ...(!decodeConfig && {
          params: {
            startDate: dates[0],
            endDate: dates[1],
          },
        }),
      },
    });
  };

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
        onViewportChange={_onViewportChange}
        onStateChange={_onStateChange}
        scrollZoom={false}
        minZoom={1}
        onClick={() => setPopupData({ ...popupData, show: false })}
        onLoad={() => setLoaded(true)}
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
            <Source id="singleProject" type="geojson" data={geoJson}>
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

        {!showSingleProject &&
          exploreProjects &&
          searchedProject.map((projectMarker: any, index: any) => (
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
                  if (!popupRef.current) {
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
            <Layer id="forest-layer" source="forests" type="raster" />
          </Source>
        ) : null}

        {/* {explorePotential ? (
          <Source
            id="potential"
            type="raster"
            tiles={[
              'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/WWF_Restoration_V3/MapServer/tile/{z}/{y}/{x}',
            ]}
            tileSize={128}
          >
            <Layer id="potential-layer" source="potential" type="raster" />
          </Source>
        ) : null} */}

        {loaded ? (
          <LayerManager map={mapRef.current.getMap()} plugin={PluginMapboxGl}>
            {exploreDeforestation &&
              TreeCoverLoss.map((layer) => {
                const {
                  id,
                  decodeConfig,
                  timelineConfig,
                  decodeFunction,
                } = layer;

                const lSettings = layersSettings[id] || {};

                const l = {
                  ...layer,
                  ...layer.config,
                  ...lSettings,
                  ...(!!decodeConfig && {
                    decodeParams: getParams(decodeConfig, {
                      ...timelineConfig,
                      ...lSettings.decodeParams,
                    }),
                    decodeFunction,
                  }),
                };

                return <LayerM key={layer.id} {...l} />;
              })}
          </LayerManager>
        ) : null}

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
                {isMobile ? null : t('maps:explore')}
              </p>
            )}
          </div>
          {exploreExpanded ? (
            <>
              <div className={styles.exploreExpanded}>
                {/* <div> */}
                <FormGroup style={{ width: '100%' }}>
                  <div className={styles.exploreToggleRow}>
                    <FormControlLabel
                      control={
                        <Switch
                          color="#448149"
                          className={styles.toggleForest}
                          checked={exploreForests}
                          onChange={handleExploreForestsChange}
                          name="forest"
                        />
                      }
                      label={t('maps:forests')}
                    />
                    <div
                      onClick={() => {
                        setInfoExpanded('Forests');
                        setModalOpen(true);
                      }}
                      className={styles.exploreInfo}
                    >
                      <InfoIcon />
                    </div>
                  </div>
                  {/* <div className={styles.exploreToggleRow}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={explorePotential}
                            onChange={handleExplorePotentialChange}
                            name="potential"
                          />
                        }
                        label={t('maps:restoration')}
                      />
                      <div
                        onClick={() => {
                          setInfoExpanded('Restoration');
                        }}
                        className={styles.exploreInfo}
                      >
                        <InfoIcon />
                      </div>
                    </div> */}

                  <div className={styles.exploreToggleRow}>
                    <FormControlLabel
                      control={
                        <Switch
                          color="#FF0000"
                          checked={exploreDeforestation}
                          onChange={handleExploreDeforestationChange}
                          name="deforestation"
                        />
                      }
                      label={t('maps:deforestation')}
                    />
                    <div
                      onClick={() => {
                        setInfoExpanded('Deforestation');
                        setModalOpen(true);
                      }}
                      className={styles.exploreInfo}
                    >
                      <InfoIcon />
                    </div>
                  </div>
                  {exploreDeforestation ? (
                    <div className={styles.deforestionSlider}>
                      <Icons />
                      <Legend collapsable={false} sortable={false}>
                        {layerLegend.map((layerGroup, i) => {
                          return (
                            <LegendListItem
                              index={i}
                              key={layerGroup.slug}
                              layerGroup={layerGroup}
                              className={styles.layerLegend}
                            >
                              {/* <LegendItemTypes /> */}
                              <LegendItemTimeStep
                                defaultStyles={{
                                  handleStyle: {
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    boxShadow:
                                      '0 1px 2px 0 rgba(0, 0, 0, 0.29)',
                                    border: '0px',
                                    zIndex: 2,
                                  },
                                  railStyle: { backgroundColor: '#d6d6d9' },
                                  dotStyle: {
                                    visibility: 'hidden',
                                    border: '0px',
                                  },
                                }}
                                handleChange={onChangeLayerDate}
                              />
                            </LegendListItem>
                          );
                        })}
                      </Legend>
                    </div>
                  ) : null}
                  {/* <div className={styles.exploreToggleRow}>
                    <FormControlLabel
                      control={
                        <Switch
                         color="#E7C746"
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
                      label={t('maps:projects')}
                    />
                  </div>
                </FormGroup>
                {/* </div> */}
                <div className={styles.exploreCaption}>
                  <p>{t('maps:3trilliontrees')}</p>
                </div>
              </div>
            </>
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
                {project &&
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
      {infoExpanded !== null ? (
        <Modal
          className={styles.modal}
          open={openModal}
          onClose={handleModalClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div ref={infoRef} className={styles.infoExpanded}>
            {infoExpanded === 'Forests' ? (
              <div className={styles.infoContainer}>
                <div className={styles.infoTitle}>{t('maps:forests')}</div>
                <div className={styles.infoContent}>
                  <div className={styles.currentForestScale}>
                    <p>{t('maps:low')}</p>
                    <div></div>
                    <p>{t('maps:high')}</p>
                  </div>
                  <p>{t('maps:forestInfo')}</p>
                  <a
                    href="https://www.nature.com/articles/nature14967"
                    target="_blank"
                    style={{ paddingTop: 20 }}
                  >
                    <OpenLink />
                    <p>
                      Crowther, T. W. et al. (2015) Mapping tree
                      <br /> density at a global scale. Nature 525, 201–205.
                    </p>
                  </a>
                </div>
              </div>
            ) : null}
            {infoExpanded === 'Restoration' ? (
              <div className={styles.infoContainer}>
                <div className={styles.infoTitle}>{t('maps:restoration')}</div>
                <div className={styles.infoContent}>
                  <div className={styles.reforestationScale}>
                    <p>{t('maps:low')}</p>
                    <div></div>
                    <p>{t('maps:high')}</p>
                  </div>
                  <p>{t('maps:restorationInfo')}</p>
                  <a
                    href="https://science.sciencemag.org/content/365/6448/76"
                    target="_blank"
                    style={{ paddingTop: 20 }}
                  >
                    <OpenLink />
                    <p>
                      Bastin, J. F. et al. (2019) The Global Tree
                      <br /> Restoration Potential. Science 365(6448), 76-79.
                    </p>
                  </a>
                </div>
              </div>
            ) : null}
            {infoExpanded === 'Deforestation' ? (
              <div className={styles.infoContainer}>
                <div className={styles.infoTitle}>
                  {t('maps:deforestation')}
                </div>
                <div className={styles.infoContent}>
                  <a
                    href="https://data.globalforestwatch.org/datasets/63f9425c45404c36a23495ed7bef1314"
                    target="_blank"
                    style={{ paddingTop: 20 }}
                  >
                    <OpenLink />
                    <p>
                      Global Forest Watch
                      <br />
                      globalforestwatch.org
                    </p>
                  </a>
                </div>
              </div>
            ) : null}
            {infoExpanded === 'Planted' ? (
              <div className={styles.infoContainer}>
                <div className={styles.infoTitle}>{infoExpanded}</div>
                <div className={styles.infoContent}></div>
              </div>
            ) : null}
            <div
              onClick={() => {
                setInfoExpanded(null);
                setModalOpen(false);
              }}
              className={styles.infoClose}
            >
              <CancelIcon color="#d5d5d5" />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
