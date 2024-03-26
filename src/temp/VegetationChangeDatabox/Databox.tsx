import React from 'react';
import styles from './VegetationChangeDatabox.module.scss';
import Dropdown from './Dropdown';
import BiomassChangeIcon from '../icons/BiomassChangeIcon';
import VegetationSlider from './VegetationSlider';
import NewInfoIcon from '../icons/NewInfoIcon';
import { useTranslation } from 'next-i18next';

interface Props {
  startYear: number;
}
const Databox = ({ startYear }: Props) => {
  const { t } = useTranslation('projectDetails');
  return (
    <div className={styles.databoxContainer}>
      <div className={styles.dropdownInfoContainer}>
        <Dropdown
          labelIcon={<BiomassChangeIcon />}
          labelTitle={t('biomassChange')}
          isOpen={false}
        />
        <p className={styles.startYearText}>
          {t('projectBegin')} {startYear}
        </p>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.sliderInfoContainer}>
        <VegetationSlider position={5} />
        <div className={styles.infoIcon}>
          <NewInfoIcon height={10} width={10} color={'#BDBDBD'} />
        </div>
      </div>
    </div>
  );
};

export default Databox;
