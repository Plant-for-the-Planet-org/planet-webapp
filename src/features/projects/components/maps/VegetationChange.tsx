import React, { ReactElement } from 'react';
import { Layer, Source } from 'react-map-gl';
import MarkerIcon from '../../../../../public/assets/images/icons/MarkerIcon';
import SatelliteIcon from '../../../../../public/assets/images/icons/SatelliteIcon';
import TreeIcon2 from '../../../../../public/assets/images/icons/TreeIcon2';
import styles from '../../styles/VegetationChange.module.scss';

interface Props {
  siteVegetationChange: any;
  selectedOption: any;
  setSelectedState: any;
  siteImagery: any;
}

export default function VegetationChange({
  siteVegetationChange,
  selectedOption,
  setSelectedState,
  siteImagery,
}: Props): ReactElement {
  return (
    <>
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
          <MarkerIcon color={selectedOption === 'none' ? '#fff' : null} />{' '}
          <p>Location</p>
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
            Imagery Comparison<sup>BETA</sup>
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
          <TreeIcon2 color={selectedOption === 'vegetation' ? '#fff' : null} />{' '}
          <p>
            Vegetation Change<sup>BETA</sup>
          </p>
        </div>
      </div>
    </>
  );
}
