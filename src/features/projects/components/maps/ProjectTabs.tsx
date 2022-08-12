import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import i18next from '../../../../../i18n';
import LocationIcon from '../../../../../public/assets/images/icons/LocationIcon';
import ResearchIcon from '../../../../../public/assets/images/icons/ResearchIcon';
import SatelliteIcon from '../../../../../public/assets/images/icons/SatelliteIcon';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import styles from '../../styles/VegetationChange.module.scss';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';

interface Props {}

export default function ProjectTabs({}: Props): ReactElement {
  const { embed, showProjectDetails } = React.useContext(ParamsContext);
  const { pathname } = useRouter();
  const { useTranslation } = i18next;
  const { i18n, t } = useTranslation(['maps']);
  const { selectedMode, setSelectedMode, rasterData } =
    React.useContext(ProjectPropsContext);

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
