import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import getImageUrl from '../../../../utils/getImageURL';
import styles from '../styles/TreeMapper.module.scss';
import i18next from '../../../../../i18n';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import TreeIcon from '../../../../../public/assets/images/icons/TreeIcon';

const { useTranslation } = i18next;

interface Props {
  setselectedLocation: Function;
  location: Object;
  setLocation: Function;
}

export default function PlantLocation({
  location,
  setselectedLocation,
  setLocation,
}: Props): ReactElement {
  const { t, i18n } = useTranslation('treemapper');
  const handleBackButton = () => {
    if (location.type === 'sample') {
      setselectedLocation(location.parent);
    } else {
      setselectedLocation('');
      setLocation(null);
    }
  };

  const DetailProps = {
    location,
    setselectedLocation,
    setLocation,
  };
  return (
    <div className={styles.locationDetails}>
      <div className={styles.pullUpContainer}>
        <div className={styles.pullUpBar}></div>
      </div>
      <div onClick={handleBackButton} className={styles.backButton}>
        <BackButton />
      </div>
      <LocationDetails {...DetailProps} />
    </div>
  );
}

interface DetailsProps {
  setselectedLocation: Function;
  location: Object;
  setLocation: Function;
}

export function LocationDetails({
  location,
  setselectedLocation,
  setLocation,
}: DetailsProps): ReactElement {
  const { t, i18n } = useTranslation('treemapper');
  return (
    <>
      <div className={styles.imageContainer}>
        {location.coordinates.map((coordinate: any) => {
          if (coordinate.image) {
            const image = getImageUrl('coordinate', 'large', coordinate.image);
            return <img key={coordinate.image} src={image} />;
          }
        })}
      </div>
      <div className={styles.details}>
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('captureMode')}</p>
          <div className={styles.value}>{location.captureMode}</div>
        </div>
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('captureStatus')}</p>
          <div className={styles.value}>{location.captureStatus}</div>
        </div>
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('coordinates')}</p>
          <div className={styles.value}>
            {location.deviceLocation.coordinates.map(
              (coord: any, index: number) => {
                return <p key={index}>{coord}</p>;
              }
            )}
          </div>
        </div>
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('guid')}</p>
          <div className={styles.value}>{location.id}</div>
        </div>
        {location.measurements && (
          <>
            <div className={styles.singleDetail}>
              <p className={styles.title}>{t('height')}</p>
              <div className={styles.value}>
                {location.measurements?.height}m
              </div>
            </div>
            <div className={styles.singleDetail}>
              <p className={styles.title}>{t('width')}</p>
              <div className={styles.value}>
                {location.measurements?.width}cm
              </div>
            </div>
          </>
        )}
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('plantDate')}</p>
          <div className={styles.value}>{formatDate(location.plantDate)}</div>
        </div>
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('registrationDate')}</p>
          <div className={styles.value}>
            {formatDate(location.registrationDate)}
          </div>
        </div>
        {location.plantProject && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{t('plantProject')}</p>
            <div className={styles.value}>{location.plantProject}</div>
          </div>
        )}
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('species')}</p>
          <div className={styles.value}>
            {location.scientificSpecies
              ? location.scientificSpecies
              : location.plantedSpecies.map((species: any) => {
                  return <p key={species.id}>{species.id}</p>;
                })}
          </div>
        </div>
        {location.type === 'multi' && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{t('sampleTrees')}</p>
            <div className={styles.value}>
              <div className={styles.sampleTrees}>
                {location.sampleTrees &&
                  location.sampleTrees.map((sampleTree: any) => {
                    return (
                      <div
                        key={sampleTree.id}
                        onClick={() => {
                          setLocation(sampleTree);
                          setselectedLocation(sampleTree.id);
                        }}
                        className={styles.tree}
                      >
                        <TreeIcon />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
