import React, { ReactElement } from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import getImageUrl from '../../../../utils/getImageURL';
import styles from '../TreeMapper.module.scss';
import i18next from '../../../../../i18n';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import TreeIcon from '../../../../../public/assets/images/icons/TreeIcon';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';

const { useTranslation } = i18next;

interface Props {
  setselectedLocation: Function;
  location: Object;
}

export default function PlantLocationPage({
  location,
  setselectedLocation,
}: Props): ReactElement {
  const { t, i18n } = useTranslation('treemapper');
  const handleBackButton = () => {
    // if (location.type === 'sample') {
    //   setselectedLocation(location.parent);
    // } else {
      setselectedLocation(null);
    // }
  };

  const DetailProps = {
    location,
    setselectedLocation,
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
}

export function LocationDetails({
  location,
  setselectedLocation,
}: DetailsProps): ReactElement {
  const { t, i18n } = useTranslation('treemapper');
  return (
    <>
      <div className={styles.imageContainer}>
        {location?.coordinates?.map((coordinate: any) => {
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
            {location?.deviceLocation?.coordinates.map(
              (coord: any, index: number) => {
                return <p key={index}>{localizedAbbreviatedNumber(
                  i18n.language,
                  Number(coord),
                  5
                )}</p>;
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
        {location.plantedSpecies &&
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('species')}</p>
          <div className={styles.value}>
            <span>
            {location?.plantedSpecies?.map((species: any) => {
                  return <p key={species.id}>{species.treeCount} {species.scientificName?species.scientificName:species.otherSpecies}</p>;
                })}
                </span>
          </div>
        </div>}
        {location.type === 'multi' && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{t('sampleTrees')}</p>
            <div className={styles.value}>
              <div className={styles.sampleTrees}>
                {location.sampleTrees &&
                  location?.sampleTrees?.map((sampleTree: any) => {
                    return (
                      <div
                        key={sampleTree.id}
                        onClick={() => {
                          setselectedLocation(sampleTree);
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
