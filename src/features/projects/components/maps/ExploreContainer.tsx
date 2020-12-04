import React, { ReactElement } from 'react';
import styles from '../../styles/MapboxMap.module.scss';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import ExploreIcon from '../../../../assets/images/icons/ExploreIcon';
import i18next from '../../../../../i18n/';
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
import { Layer, Source } from 'react-map-gl';
import TreeCoverLoss from '../../../../../public/data/layers/tree-cover-loss';
import { getParams } from '../../../../utils/LayerManagerUtils';

const { useTranslation } = i18next;

interface Props {
  exploreContainerRef: any;
  setExploreExpanded: Function;
  exploreExpanded: any;
  isMobile: Boolean;
  setInfoExpanded: Function;
  setModalOpen: Function;
  loaded: Boolean;
  mapRef: any;
  exploreProjects: any;
  handleExploreProjectsChange: any;
}

function ExploreContainer({
  exploreContainerRef,
  setExploreExpanded,
  exploreExpanded,
  isMobile,
  setInfoExpanded,
  setModalOpen,
  loaded,
  mapRef,
  exploreProjects,
  handleExploreProjectsChange,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['maps']);
  const [layersSettings, setLayersSettings] = React.useState({});

  const [exploreForests, setExploreForests] = React.useState(false);

  const [explorePotential, setExplorePotential] = React.useState(false);

  const [exploreDeforestation, setExploreDeforestation] = React.useState(false);

  const [explorePlanted, setExplorePlanted] = React.useState(false);

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
            TreeCoverLoss &&
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
                      {layerLegend &&
                        layerLegend.map((layerGroup, i) => {
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
    </>
  );
}

export default ExploreContainer;
