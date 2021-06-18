import React, { ReactElement } from 'react';
import i18next from '../../../../../i18n';
import LocationIcon from '../../../../../public/assets/images/icons/LocationIcon';
import ResearchIcon from '../../../../../public/assets/images/icons/ResearchIcon';
import SatelliteIcon from '../../../../../public/assets/images/icons/SatelliteIcon';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import styles from '../../styles/VegetationChange.module.scss';

interface Props {}

export default function ProjectTabs({}: Props): ReactElement {
  const { useTranslation } = i18next;
  const { i18n, t } = useTranslation(['maps']);
  const { selectedMode, setSelectedMode, rasterData } = React.useContext(
    ProjectPropsContext
  );
  return (
    <>
      <div className={styles.VegetationChangeContainer}>
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
          className={styles.options}
        >
          <LocationIcon color={selectedMode === 'location' ? '#fff' : null} />{' '}
          <p>{t('maps:location')}</p>
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
          className={styles.options}
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
