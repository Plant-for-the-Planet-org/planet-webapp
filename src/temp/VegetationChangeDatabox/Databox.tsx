import React from 'react';
import styles from './VegetationChangeDatabox.module.scss';
import Dropdown from './Dropdown';
import BiomassChangeIcon from '../icons/BiomassChangeIcon';
import VegetationSlider from './VegetationSlider';
import NewInfoIcon from '../icons/NewInfoIcon';

interface Props {
  startYear: number;
}
const Databox = ({ startYear }: Props) => {
  return (
    <div className={styles.databoxContainer}>
      <div className={styles.dropdownInfoContainer}>
        <Dropdown
          labelIcon={<BiomassChangeIcon />}
          labelTitle={'Biomass Change'}
          isOpen={false}
        />
        <p className={styles.startYearText}>Since project begin {startYear}</p>
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
