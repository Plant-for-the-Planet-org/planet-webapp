import type { ReactElement } from 'react';

import { useContext } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import LocationIcon from '../../../../../public/assets/images/icons/LocationIcon';
import ResearchIcon from '../../../../../public/assets/images/icons/ResearchIcon';
import SatelliteIcon from '../../../../../public/assets/images/icons/SatelliteIcon';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import styles from '../../styles/VegetationChange.module.scss';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import themeProperties from '../../../../theme/themeProperties';

export default function ProjectTabs(): ReactElement {
  const { embed, showProjectDetails } = useContext(ParamsContext);
  const router = useRouter();
  const t = useTranslations('Maps');
  const { selectedMode, setSelectedMode, rasterData } = useProjectProps();
  const { warmGreen } = themeProperties.designSystem.colors;

  const containerClasses =
    embed !== 'true'
      ? styles.VegetationChangeContainer
      : router.pathname.includes('/projects-archive/[p]') &&
        showProjectDetails === 'false'
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
                  backgroundColor: warmGreen,
                  border: 'none',
                }
              : {}
          }
          className={`${styles.options} ${styles.compact}`}
        >
          <LocationIcon color={selectedMode === 'location' ? '#fff' : null} />{' '}
          <p>{t('fieldData')}</p>
        </div>
        <div
          onClick={() => {
            setSelectedMode('imagery');
          }}
          style={
            selectedMode === 'imagery'
              ? {
                  color: '#fff',
                  backgroundColor: warmGreen,
                  border: 'none',
                }
              : {}
          }
          className={`${styles.options} ${styles.compact}`}
        >
          <SatelliteIcon color={selectedMode === 'imagery' ? '#fff' : null} />{' '}
          <p>
            {t('timeTravelTab')}
            <sup>{t('beta')}</sup>
          </p>
        </div>
        {/* Raster data for multipolygons is not supported and is returned with an error for such projects. In this case rasterData.evi will not exist*/}
        {rasterData.evi ? (
          <div
            onClick={() => {
              setSelectedMode('vegetation');
            }}
            style={
              selectedMode === 'vegetation'
                ? {
                    color: '#fff',
                    backgroundColor: warmGreen,
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
              {t('vegetationChange')}
              <sup>{t('beta')}</sup>
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}
