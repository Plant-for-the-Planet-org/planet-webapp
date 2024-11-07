import React, { ReactElement } from 'react';
import styles from '../../styles/ProjectsMap.module.scss';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import ExploreIcon from '../../../../../public/assets/images/icons/ExploreIcon';
import { useLocale, useTranslations } from 'next-intl';
import { Modal, FormGroup, FormControlLabel } from '@mui/material';
import Switch from '../../../common/InputTypes/ToggleSwitch';
import {
  Icons,
  Legend,
  LegendListItem,
  LegendItemTimeStep,
} from 'vizzuality-components';
import { FlyToInterpolator } from 'react-map-gl';
import TreeCoverLoss from '../../../../../public/data/layers/tree-cover-loss';
import { getParams } from '../../../../utils/LayerManagerUtils';
import ExploreInfoModal from './ExploreInfoModal';
import * as d3 from 'd3-ease';
import { useRouter } from 'next/router';
import { ThemeContext } from '../../../../theme/themeContext';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

interface LayerType {
  id: string;
  decodeConfig: boolean;
}

export default function Explore(): ReactElement {
  const {
    setShowProjects,
    exploreExpanded,
    setExploreExpanded,
    /* 24 Apr 2023 - temp. disable "Current Forests" / "Restoration Potential" toggles on map */
    /* exploreForests,
    setExploreForests, 
    explorePotential,
    setExplorePotential,*/
    exploreDeforestation,
    setExploreDeforestation,
    infoExpanded,
    setInfoExpanded,
    openModal,
    setModalOpen,
    exploreContainerRef,
    infoRef,
    layersSettings,
    setLayersSettings,
    viewport,
    setViewPort,
    setExploreProjects,
    defaultMapCenter,
    isMobile,
    exploreProjects,
  } = useProjectProps();

  const t = useTranslations('Maps');
  const locale = useLocale();
  const router = useRouter();

  const { theme } = React.useContext(ThemeContext);
  const { embed, callbackUrl } = React.useContext(ParamsContext);
  const { isImpersonationModeOn } = useUserProps();

  const handleModalClose = () => {
    setModalOpen(false);
  };

  // Event Handlers
  /* 24 Apr 2023 - temp. disable "Current Forests" / "Restoration Potential" toggles on map */
  /* const handleExploreForestsChange = (event: any) => {
    setExploreForests(event.target.checked);
  };
  const handleExplorePotentialChange = (event: any) => {
    setExplorePotential(event.target.checked);
  }; */
  const handleExploreDeforestationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExploreDeforestation(event.target.checked);
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

  const onChangeLayerDate = (dates: string[], layer: LayerType) => {
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

  const handleExploreProjectsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      router.push(
        `${locale}/projects-archive${
          embed === 'true'
            ? `${
                callbackUrl != undefined
                  ? `?embed=true&callback=${callbackUrl}`
                  : '?embed=true'
              }`
            : ''
        }`,
        undefined,
        {
          shallow: true, //As Explore is only shown on the index route, we don't want to reload the page
        }
      );
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', (event) => {
      if (exploreExpanded) {
        if (
          exploreContainerRef &&
          exploreContainerRef.current &&
          event.target !== null &&
          event.target instanceof Node &&
          !exploreContainerRef.current.contains(event.target)
        ) {
          setExploreExpanded(false);
        }
      }
    });
  });

  // React.useEffect(() => {
  //   if (exploreExpanded) {
  //     setMapState({ ...mapState, dragPan: false });
  //   } else {
  //     setMapState({ ...mapState, dragPan: true });
  //   }
  // }, [exploreExpanded]);

  return (
    <>
      <div ref={exploreContainerRef}>
        <div
          className={
            embed === 'true' ? styles.embed_exploreButton : styles.exploreButton
          }
          onClick={() => {
            setExploreExpanded(!exploreExpanded);
          }}
          style={
            exploreExpanded
              ? {
                  padding: '4px 10px',
                  marginTop: isImpersonationModeOn ? '46px' : '',
                }
              : { marginTop: isImpersonationModeOn ? '46px' : '' }
          }
        >
          {exploreExpanded ? <CancelIcon /> : <ExploreIcon />}
          {exploreExpanded ? null : isMobile ? null : (
            <p
              onClick={() => setExploreExpanded(true)}
              className={styles.exploreText}
            >
              {t('explore')}
            </p>
          )}
        </div>
        {exploreExpanded ? (
          <>
            <div
              className={
                embed === 'true'
                  ? styles.embed_exploreExpanded
                  : styles.exploreExpanded
              }
            >
              {/* <div> */}
              <FormGroup style={{ width: '100%' }}>
                {/* 24 Apr 2023 - temp. disable "Current Forests" / "Restoration Potential" toggles on map */}
                {/* <div className={styles.exploreToggleRow}>
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={true}
                        color="#448149"
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
                        disabled={true}
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
                    label={t('deforestation')}
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
                <div className={styles.exploreToggleRow}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={exploreProjects}
                        onChange={handleExploreProjectsChange}
                        name="projects"
                      />
                    }
                    label={t('projects')}
                  />
                </div>
              </FormGroup>
              {/* </div> */}
              <div className={styles.exploreCaption}>
                <p>{t('3trilliontrees')}</p>
              </div>
            </div>
          </>
        ) : null}
      </div>
      {infoExpanded !== null ? (
        <Modal
          className={'modalContainer' + ' ' + theme}
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
