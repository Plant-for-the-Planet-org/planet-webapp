import React, { ReactElement } from 'react';
import { Router, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LocationIcon from '../../../../../public/assets/images/icons/LocationIcon';
import ResearchIcon from '../../../../../public/assets/images/icons/ResearchIcon';
import SatelliteIcon from '../../../../../public/assets/images/icons/SatelliteIcon';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import styles from '../../styles/VegetationChange.module.scss';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';

interface Props {}

export default function ProjectTabs({}: Props): ReactElement {
  const { embed, showProjectDetails } = React.useContext(ParamsContext);
  const { pathname, query, push } = useRouter();
  const { t } = useTranslation(['maps']);
  const {
    selectedMode,
    setSelectedMode,
    rasterData,
    selectedSite,
    project,
    geoJson,
    plantLocations,
  } = React.useContext(ProjectPropsContext);

  React.useEffect(() => {
    if (plantLocations) {
      if (query.view === 'field-data') {
        setSelectedMode('location');
      } else if (query.view === 'time-travel') {
        setSelectedMode('imagery');
      } else {
        setSelectedMode('location');
      }
    }
  }, [plantLocations, query.view]);

  const containerClasses =
    embed !== 'true'
      ? styles.VegetationChangeContainer
      : pathname === '/[p]' && showProjectDetails === 'false'
      ? `${styles.embed_VegetationChangeContainer} ${styles['no-project-details']}`
      : styles.embed_VegetationChangeContainer;

  return (
    <>
      <div className={containerClasses}>
        <div
          onClick={() => {
            push(
              `/${project.slug}/?site=${geoJson.features[selectedSite].properties.id}&view=field-data`
            );
            setSelectedMode('location');
          }}
          style={
            selectedMode === 'location'
              ? {
                  color: '#fff',
                  backgroundColor: styles.primaryColor,
                  border: 'none',
                }
              : {}
          }
          className={`${styles.options} ${styles.compact}`}
        >
          <LocationIcon color={selectedMode === 'location' ? '#fff' : null} />{' '}
          <p>{t('maps:fieldData')}</p>
        </div>
        <div
          onClick={() => {
            push(
              `/${project.slug}/?site=${geoJson.features[selectedSite].properties.id}&view=time-travel`
            );
            setSelectedMode('imagery');
          }}
          style={
            selectedMode === 'imagery'
              ? {
                  color: '#fff',
                  backgroundColor: styles.primaryColor,
                  border: 'none',
                }
              : {}
          }
          className={`${styles.options} ${styles.compact}`}
        >
          <SatelliteIcon color={selectedMode === 'imagery' ? '#fff' : null} />{' '}
          <p>
            {t('maps:timeTravel')}
            <sup>{t('maps:beta')}</sup>
          </p>
        </div>
        {rasterData.evi ? (
          <div
            onClick={() => {
              setSelectedMode('vegetation');
            }}
            style={
              selectedMode === 'vegetation'
                ? {
                    color: '#fff',
                    backgroundColor: styles.primaryColor,
                    border: 'none',
                  }
                : {}
            }
            className={styles.options}
          >
            <ResearchIcon
              color={selectedMode === 'vegetation' ? '#fff' : null}
            />{' '}
            <p>
              {t('maps:vegetationChange')}
              <sup>{t('maps:beta')}</sup>
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}
