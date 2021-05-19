import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import getImageUrl from '../../../../utils/getImageURL';
import styles from '../styles/TreeMapper.module.scss';
import i18next from '../../../../../i18n';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import TreeIcon from '../../../../../out/assets/images/icons/TreeIcon';

const { useTranslation } = i18next;

interface Props {
  selectedLocation: string;
  setselectedLocation: Function;
  plantLocations: Object;
  isDataLoading: boolean;
  location: Object;
  setLocation: Function;
}

const PlantLocationMap = dynamic(() => import('../components/TreeMapper/Map'), {
  loading: () => <p>loading</p>,
});

export default function PlantLocation({
  location,
  selectedLocation,
  setselectedLocation,
  plantLocations,
  isDataLoading,
  setLocation,
}: Props): ReactElement {
  const { t, i18n } = useTranslation('me');
  const handleBackButton = () => {
    if (location.type === 'sample') {
      setselectedLocation(location.parent);
    } else {
      setselectedLocation('');
    }
  };
  return (
    <div id="pageContainer" className={styles.singleLocationPage}>
      <div className={styles.section}>
        <div className={styles.locationDetails}>
          <div className={styles.pullUpContainer}>
            <div className={styles.pullUpBar}></div>
          </div>
          <div onClick={handleBackButton} className={styles.backButton}>
            <BackButton />
          </div>
          <div className={styles.imageContainer}>
            {location.coordinates.map((coordinate: any) => {
              const image = getImageUrl(
                'coordinate',
                'large',
                coordinate.image
              );
              return <img src={image} />;
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
                {location.deviceLocation.coordinates.map((coord: any) => {
                  return <p>{coord}</p>;
                })}
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
              <div className={styles.value}>
                {formatDate(location.plantDate)}
              </div>
            </div>
            <div className={styles.singleDetail}>
              <p className={styles.title}>{t('registrationDate')}</p>
              <div className={styles.value}>
                {formatDate(location.registrationDate)}
              </div>
            </div>
            <div className={styles.singleDetail}>
              <p className={styles.title}>{t('species')}</p>
              <div className={styles.value}>
                {location.scientificSpecies
                  ? location.scientificSpecies
                  : location.plantedSpecies.map((species: any) => {
                      return <p>{species.id}</p>;
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
        </div>
        <div className={styles.mapContainer}>
          <div id="pp-mapbox" className={styles.map}>
            <PlantLocationMap
              locations={plantLocations}
              selectedLocation={selectedLocation}
              setselectedLocation={setselectedLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
