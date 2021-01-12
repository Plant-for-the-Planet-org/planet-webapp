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
import LeftIcon from '../../../../public/assets/images/icons/LeftIcon';
import RightIcon from '../../../../public/assets/images/icons/RightIcon';
import styles from '../styles/MapboxMap.module.scss';
import { Modal } from '@material-ui/core';
import ExploreInfoModal from './maps/ExploreInfoModal';
import ExploreContainer from './maps/ExploreContainer';
import PopupProject from './PopupProject';
import { getEarthEngineLayer } from '../../../utils/apiRequests/api';
import VegetationChange from './maps/VegetationChange';
import i18next from '../../../../i18n';
import SelectLanguageAndCountry from '../../common/Layout/Footer/SelectLanguageAndCountry';
import getMapStyle from '../../../utils/getMapStyle';
import dynamic from 'next/dynamic';
import ImagerySwitcher from './maps/ImagerySwitcher';
import { Image } from 'react-mapbox-gl';

const MapCompare = dynamic(() => import('./CompareMaps'), { ssr: false });

const { useTranslation } = i18next;

interface mapProps {
  projects: any;
  project: any;
  showSingleProject: Boolean;
  setShowProjects: Function;
  searchedProject: any;
  showProjects: any;
  currencyCode: any;
  setCurrencyCode: Function;
}
export default function MapboxMap({
  projects,
  project,
  showSingleProject,
  setShowProjects,
  searchedProject,
  showProjects,
  setCurrencyCode,
}: mapProps) {
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout;
  const router = useRouter();

  const { i18n, t } = useTranslation(['common']);

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
  const infoRef = useRef(null);
  const [siteVegetationChange, setSiteVegetationChange] = useState(null);
  const [siteImagery, setSiteImagery] = useState(null);
  const [selectedOption, setSelectedState] = React.useState('none');
  const [projectCenter, setProjectCenter] = React.useState(defaultMapCenter);
  const [projectZoom, setProjectZoom] = React.useState(defaultZoom);
  const [selectedYear1, setSelectedYear1] = React.useState('2017');
  const [selectedYear2, setSelectedYear2] = React.useState('2020');

  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };

  const [style, setStyle] = React.useState(EMPTY_STYLE);

  const [mapState, setMapState] = useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
  });

  const [viewport, setViewPort] = useState({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  React.useEffect(() => {
    const promise = getMapStyle('default');
    promise.then((style) => {
      if (style) {
        setMapState({ ...mapState, mapStyle: style });
        setStyle(style);
      }
    });
  }, []);

  const [language, setLanguage] = useState(i18n.language);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [selectedCountry, setSelectedCountry] = useState('DE');

  const [openLanguageModal, setLanguageModalOpen] = React.useState(false);
  const handleLanguageModalClose = () => {
    setLanguageModalOpen(false);
  };
  const handleLanguageModalOpen = () => {
    setLanguageModalOpen(true);
  };

  const [exploreExpanded, setExploreExpanded] = React.useState(false);

  const [exploreProjects, setExploreProjects] = React.useState(true);

  const [infoExpanded, setInfoExpanded] = React.useState(null);

  const [openModal, setModalOpen] = React.useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
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
      // const newMapState = {
      //   ...mapState,
      //   mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
      // };
      const newViewport = {
        ...viewport,
        latitude: defaultMapCenter[0],
        longitude: defaultMapCenter[1],
        zoom: 1.4,
        transitionDuration: 1200,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      // setMapState(newMapState);
      setViewPort(newViewport);
      router.push('/', undefined, {
        shallow: true,
      });
    }
  };

  const VegetationChangeProps = {
    selectedOption,
    setSelectedState,
    siteVegetationChange,
    siteImagery,
  };

  const ImagerySwitcherProps = {
    selectedYear1,
    setSelectedYear1,
    selectedYear2,
    setSelectedYear2,
  };

  const CompareProps = {
    siteImagery,
    mapRef,
    projectCenter,
    projectZoom,
    selectedYear1,
    selectedYear2,
    style,
  };

  async function fetchData(data: any) {
    const siteVgData = await getEarthEngineLayer(data);
    siteVgData
      ? () => {
          setSiteVegetationChange(siteVgData.data.ndvi);
          setSiteImagery(siteImageryData.data.imagery);
        }
      : null;
    console.log(siteVgData);
  }

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
            // const newMapState = {
            //   ...mapState,
            //   mapStyle: 'mapbox://styles/mapbox/satellite-v9',
            // };
            const newViewport = {
              ...viewport,
              longitude,
              latitude,
              zoom,
              transitionDuration: 4000,
              transitionInterpolator: new FlyToInterpolator(),
              transitionEasing: d3.easeCubic,
            };
            setProjectCenter([longitude, latitude]);
            setProjectZoom(zoom);
            fetchData(geoJson);
            setViewPort(newViewport);
            // setMapState(newMapState);
          }
        } else {
          // const newMapState = {
          //   ...mapState,
          //   mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
          // };
          const newViewport = {
            ...viewport,
            longitude: singleProjectLatLong[1],
            latitude: singleProjectLatLong[0],
            zoom: 5,
            transitionDuration: 4000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic,
          };
          // setMapState(newMapState);
          setViewPort(newViewport);
        }
      } else {
        // const newMapState = {
        //   ...mapState,
        //   mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
        // };
        const newViewport = {
          ...viewport,
          latitude: defaultMapCenter[0],
          longitude: defaultMapCenter[1],
          zoom: 1.4,
          transitionDuration: 2400,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };
        // setMapState(newMapState);
        setViewPort(newViewport);
      }
    } else {
      // const newMapState = {
      //   ...mapState,
      //   mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
      // };
      const newViewport = {
        ...viewport,
        latitude: defaultMapCenter[0],
        longitude: defaultMapCenter[1],
        zoom: 1.4,
        transitionDuration: 2400,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      // setMapState(newMapState);
      setViewPort(newViewport);
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
          exploreContainerRef.current &&
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

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // changes the language and selected country as found in local storage
  React.useEffect(() => {
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('currencyCode')) {
        let currencyCode = localStorage.getItem('currencyCode');
        if (currencyCode) setSelectedCurrency(currencyCode);
      }
      if (localStorage.getItem('countryCode')) {
        let countryCode = localStorage.getItem('countryCode');
        if (countryCode) setSelectedCountry(countryCode);
      }
      if (localStorage.getItem('language')) {
        let langCode = localStorage.getItem('language');
        if (langCode) setLanguage(langCode);
      }
    }
  }, [selectedCurrency]);

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

  const [userLang, setUserLang] = React.useState('en');
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('language')) {
        let userLang = localStorage.getItem('language');
        if (userLang) setUserLang(userLang);
      }
    }
  }, []);

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        onViewportChange={_onViewportChange}
        onStateChange={_onStateChange}
        scrollZoom={false}
        minZoom={1}
        maxZoom={15}
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
          ) : selectedOption === 'none' ? (
            <>
              <Source
                id="satellite"
                type="raster"
                tiles={[
                  'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                ]}
                tileSize={128}
              >
                <Layer id="satellite-layer" source="satellite" type="raster" />
              </Source>
              <Source id="singleProject" type="geojson" data={geoJson}>
                <Layer
                  id="ploygonOutline"
                  type="line"
                  source="singleProject"
                  paint={{
                    'line-color': '#fff',
                    'line-width': 4,
                  }}
                />
              </Source>
            </>
          ) : (
            <Source id="singleProject" type="geojson" data={geoJson}>
              <Layer
                id="ploygonOutline"
                type="line"
                source="singleProject"
                paint={{
                  'line-color': '#fff',
                  'line-width': 4,
                }}
              />
            </Source>
          )
        ) : null}
        {selectedOption === 'vegetation' ? (
          siteVegetationChange ? (
            <Source
              id="ndvi"
              type="raster"
              tiles={[`${siteVegetationChange}`]}
              tileSize={128}
            >
              <Layer id="ndvi-layer" source="ndvi" type="raster" />
            </Source>
          ) : null
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
              />
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

        {showSingleProject ? (
          <VegetationChange {...VegetationChangeProps} />
        ) : null}

        <div className={styles.mapNavigation}>
          <NavigationControl showCompass={false} />
        </div>

        <ExploreContainer
          exploreContainerRef={exploreContainerRef}
          setExploreExpanded={setExploreExpanded}
          exploreExpanded={exploreExpanded}
          isMobile={isMobile}
          setInfoExpanded={setInfoExpanded}
          setModalOpen={setModalOpen}
          loaded={loaded}
          mapRef={mapRef}
          handleExploreProjectsChange={handleExploreProjectsChange}
          exploreProjects={exploreProjects}
        />

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
        <div className={styles.lngSwitcher + ' mapboxgl-map'}>
          <div
            onClick={() => {
              setLanguageModalOpen(true);
            }}
          >
            {`🌐 ${
              language ? language.toUpperCase() : ''
            } • ${selectedCurrency}`}
          </div>
          <a
            rel="noopener noreferrer"
            href={`https://a.plant-for-the-planet.org/${userLang}/imprint`}
            target={'_blank'}
          >
            {t('common:imprint')}
          </a>
          <a
            rel="noopener noreferrer"
            href={`https://a.plant-for-the-planet.org/${userLang}/privacy-terms`}
            target={'_blank'}
          >
            {t('common:privacyAndTerms')}
          </a>

          <a
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              overflow: 'visible',
            }}
          >
            <div style={{ width: 'fit-content' }}>
              <div className={styles.popover}>
                {t('common:mapInfo')}
                <div
                  className={styles.popoverContent}
                  style={{ left: '-270px', top: '-140px' }}
                >
                  <a>
                    Esri Community Maps Contributors, Esri, HERE, Garmin,
                    METI/NASA, USGS
                    <br />
                    Imagery: Esri, Maxar, Earthstar Geographics, CNES/Airbus DS,
                    USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User
                    Community
                  </a>
                </div>
              </div>
            </div>
          </a>

          <a
            rel="noopener noreferrer"
            href="mailto:support@plant-for-the-planet.org"
            target={'_blank'}
          >
            {t('common:contact')}
          </a>
        </div>
      </MapGL>
      {showSingleProject &&
      siteExists &&
      selectedOption === 'imagery' &&
      siteImagery ? (
        <MapCompare {...CompareProps} />
      ) : null}

      {showSingleProject && selectedOption === 'imagery' ? (
        <ImagerySwitcher {...ImagerySwitcherProps} />
      ) : null}

      {infoExpanded !== null ? (
        <Modal
          className={styles.modal}
          open={openModal}
          onClose={handleModalClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <ExploreInfoModal
            infoRef={infoRef}
            infoExpanded={infoExpanded}
            setInfoExpanded={setInfoExpanded}
            setModalOpen={setModalOpen}
          />
        </Modal>
      ) : null}
      <SelectLanguageAndCountry
        openModal={openLanguageModal}
        handleModalClose={handleLanguageModalClose}
        language={language}
        setLanguage={setLanguage}
        setSelectedCurrency={setSelectedCurrency}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        setCurrencyCode={setCurrencyCode}
      />
    </div>
  );
}
