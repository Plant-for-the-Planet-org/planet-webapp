import React, { ReactElement } from 'react';
import SatelliteIcon from '../../../../../public/assets/images/icons/SatelliteIcon';
import styles from '../../styles/VegetationChange.module.scss';
import i18next from '../../../../../i18n';
import LocationIcon from '../../../../../public/assets/images/icons/LocationIcon';
import ResearchIcon from '../../../../../public/assets/images/icons/ResearchIcon';

interface Props {
  siteVegetationChange: any;
  selectedOption: any;
  setSelectedState: any;
  siteImagery: any;
}

const { useTranslation } = i18next;

export default function VegetationChange({
  selectedOption,
  setSelectedState,
}: Props): ReactElement {
  const { i18n, t } = useTranslation(['maps']);
  return (
    <div className={styles.VegetationChangeContainer}>
      <div
        onClick={() => {
          setSelectedState('none');
        }}
        style={
          selectedOption === 'none'
            ? {
              color: '#fff',
              backgroundColor: styles.primaryColor,
              border: 'none',
            }
            : {}
        }
        className={styles.options}
      >
        <LocationIcon color={selectedOption === 'none' ? '#fff' : null} />{' '}
        <p>{t('maps:location')}</p>
      </div>
      <div
        onClick={() => {
          setSelectedState('imagery');
        }}
        style={
          selectedOption === 'imagery'
            ? {
              color: '#fff',
              backgroundColor: styles.primaryColor,
              border: 'none',
            }
            : {}
        }
        className={styles.options}
      >
        <SatelliteIcon color={selectedOption === 'imagery' ? '#fff' : null} />{' '}
        <p>
          {t('maps:timeTravel')}<sup>{t('maps:beta')}</sup>
        </p>
      </div>
      <div
        onClick={() => {
          setSelectedState('vegetation');
        }}
        style={
          selectedOption === 'vegetation'
            ? {
              color: '#fff',
              backgroundColor: styles.primaryColor,
              border: 'none',
            }
            : {}
        }
        className={styles.options}
      >
        <ResearchIcon color={selectedOption === 'vegetation' ? '#fff' : null} />{' '}
        <p>
          {t('maps:vegetationChange')}<sup>{t('maps:beta')}</sup>
        </p>
      </div>
    </div>
  );
}
