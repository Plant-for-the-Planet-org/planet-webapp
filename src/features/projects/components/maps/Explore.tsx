import React, { ReactElement } from 'react';
import styles from '../../styles/ProjectsMap.module.scss';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import ExploreIcon from '../../../../../public/assets/images/icons/ExploreIcon';
import i18next from '../../../../../i18n';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '../../../common/InputTypes/ToggleSwitch';
import {
  Icons,
  Legend,
  LegendListItem,
  LegendItemTimeStep,
} from 'vizzuality-components';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';
import { LayerManager, Layer as LayerM } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import { FlyToInterpolator, Layer, Source } from 'react-map-gl';
import TreeCoverLoss from '../../../../../public/data/layers/tree-cover-loss';
import { getParams } from '../../../../utils/LayerManagerUtils';
import { Modal } from '@material-ui/core';
import ExploreInfoModal from './ExploreInfoModal';
import * as d3 from 'd3-ease';
import { useRouter } from 'next/router';

interface Props {
  loaded: Boolean;
  mapRef: Object;
  setShowProjects: Function;
  viewport: Object;
  setViewPort: Function;
  setExploreProjects: Function;
  defaultMapCenter: Array<number>;
  mapState: Object;
  setMapState: Function;
  isMobile: Boolean;
  exploreProjects: Boolean;
  showSingleProject: boolean;
}

export default function Explore({
  loaded,
  mapRef,
  setShowProjects,
  viewport,
  setViewPort,
  setExploreProjects,
  defaultMapCenter,
  mapState,
  setMapState,
  isMobile,
  exploreProjects,
  showSingleProject,
}: Props): ReactElement {
  const { useTranslation } = i18next;
  const { t, i18n, ready } = useTranslation(['maps']);
  const router = useRouter();

  const infoRef = React.useRef(null);
  const exploreContainerRef = React.useRef(null);
  const [exploreExpanded, setExploreExpanded] = React.useState(false);
  const [exploreForests, setExploreForests] = React.useState(false);
  const [explorePotential, setExplorePotential] = React.useState(false);
  const [exploreDeforestation, setExploreDeforestation] = React.useState(false);
  const [explorePlanted, setExplorePlanted] = React.useState(false);
  const [infoExpanded, setInfoExpanded] = React.useState(null);
  const [openModal, setModalOpen] = React.useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  // Layer Manager
  const [layersSettings, setLayersSettings] = React.useState({});

  // Event Handlers
  const handleExploreForestsChange = (event: any) => {
    setExploreForests(event.target.checked);
  };
  const handleExplorePotentialChange = (event: any) => {
    setExplorePotential(event.target.checked);
  };
  const handleExploreDeforestationChange = (event: any) => {
    setExploreDeforestation(event.target.checked);
  };
  const handleExplorePlantedChange = (event: any) => {
    setExplorePlanted(event.target.checked);
  };

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

  const onChangeLayerDate = (dates: any, layer: any) => {
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

  const handleExploreProjectsChange = (event: any) => {
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

  return (
    <>
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

      {explorePotential ? (
        <Source
          id="potential"
          type="raster"
          tiles={[
            'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Restoration_Potential_Bastin_2019_V3/MapServer/tile/{z}/{y}/{x}',
          ]}
          tileSize={128}
        >
          <Layer id="potential-layer" source="potential" type="raster" />
        </Source>
      ) : null}

      <div ref={exploreContainerRef}>
        <div
          className={styles.exploreButton}
          onClick={() => {
            setExploreExpanded(!exploreExpanded);
          }}
          style={exploreExpanded ? { padding: '4px 10px' } : {}}
        >
          {exploreExpanded ? <CancelIcon /> : <ExploreIcon />}
          {exploreExpanded ? null : (
            <p
              onClick={() => setExploreExpanded(true)}
              className={styles.exploreText}
            >
              {isMobile || showSingleProject ? null : t('maps:explore')}
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
                <div className={styles.exploreToggleRow}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={explorePotential}
                        onChange={handleExplorePotentialChange}
                        name="potential"
                        color="#3B00FF"
                      />
                    }
                    label={t('maps:restoration')}
                  />
                  <div
                    onClick={() => {
                      setInfoExpanded('Restoration');
                      setModalOpen(true);
                    }}
                    className={styles.exploreInfo}
                  >
                    <InfoIcon />
                  </div>
                </div>

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
                                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.29)',
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
    </>
  );
}
