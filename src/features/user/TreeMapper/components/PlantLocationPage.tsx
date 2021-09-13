import React, { ReactElement } from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import getImageUrl from '../../../../utils/getImageURL';
import styles from '../TreeMapper.module.scss';
import i18next from '../../../../../i18n';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import TreeIcon from '../../../../../public/assets/images/icons/TreeIcon';
import {
  getFormattedNumber,
  localizedAbbreviatedNumber,
} from '../../../../utils/getFormattedNumber';
import dynamic from 'next/dynamic';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import EditIcon from '../../../../../public/assets/images/icons/manageProjects/Pencil';
import router, { useRouter } from 'next/router';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import CopyToClipboard from '../../../common/CopyToClipboard';

const { useTranslation } = i18next;

interface Props {
  setselectedLocation: Function;
  location: Object;
  plantLocations: any;
}

const ImageSlider = dynamic(
  () => import('../../../projects/components/PlantLocation/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

const ImageSliderSingle = dynamic(
  () => import('../../../projects/components/projectDetails/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

export default function PlantLocationPage({
  location,
  setselectedLocation,
  plantLocations,
}: Props): ReactElement {
  const router = useRouter();
  const { t, i18n } = useTranslation('treemapper');
  const handleBackButton = () => {
    if (location.type === 'sample') {
      for (const i in plantLocations) {
        if (Object.prototype.hasOwnProperty.call(plantLocations, i)) {
          const pl = plantLocations[i];
          if (pl.id === location.parent) {
            setselectedLocation(pl);
            break;
          }
        }
      }
    } else {
      router.replace('/profile/treemapper');
    }
  };

  const handleDeleteButton = () => {
    router.replace('/profile/treemapper');
  };

  const handleEditButton = () => {};

  const DetailProps = {
    location,
    setselectedLocation,
  };
  return (
    <div className={styles.locationDetails}>
      <div className={styles.pullUpContainer}>
        <div className={styles.pullUpBar}></div>
      </div>
      <div className={styles.locationNav}>
        <div onClick={handleBackButton} className={styles.backButton}>
          <BackButton />
        </div>
        <div className={styles.locationMenu}>
          {/* <div onClick={handleEditButton} className={styles.editButton}>
        <EditIcon/>
      </div>
      <div onClick={handleDeleteButton} className={styles.deleteButton}>
        <TrashIcon />
      </div> */}
        </div>
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
  const { t, i18n, ready } = useTranslation(['treemapper', 'maps']);
  const [sampleTreeImages, setSampleTreeImages] = React.useState([]);
  const coordinateRef = React.useRef(null);

  const text = `${location?.deviceLocation?.coordinates.map(
    (coord: any, index: number) => {
      return getFormattedNumber(i18n.language, Number(coord));
    }
  )}`;

  React.useEffect(() => {
    if (
      ready &&
      location &&
      location.samplePlantLocations &&
      location.samplePlantLocations.length > 0
    ) {
      const images = [];
      for (const key in location.samplePlantLocations) {
        if (
          Object.prototype.hasOwnProperty.call(
            location.samplePlantLocations,
            key
          )
        ) {
          const element = location.samplePlantLocations[key];

          if (element.coordinates?.[0]) {
            images.push({
              image: element.coordinates[0].image,
              description: `${t('maps:sampleTree')} ${
                element.tag ? '#' + element.tag : ''
              }`,
            });
          }
        }
      }
      setSampleTreeImages(images);
    } else {
      setSampleTreeImages([]);
    }
  }, [location, ready]);
  return (
    <>
      {location.type === 'multi' && sampleTreeImages.length > 0 && (
        <div className={styles.projectImageSliderContainer}>
          <ImageSlider
            images={sampleTreeImages}
            height={233}
            imageSize="large"
            type="coordinate"
          />
        </div>
      )}
      {location.type !== 'multi' && location.coordinates?.length > 0 && (
        <div
          className={`${styles.projectImageSliderContainer} ${styles.singlePl}`}
        >
          <ImageSliderSingle
            images={location.coordinates}
            height={233}
            imageSize="large"
            type="coordinate"
          />
        </div>
      )}
      <div className={styles.details}>
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('captureMode')}</p>
          <div className={styles.value}>{t(location.captureMode)}</div>
        </div>
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('captureStatus')}</p>
          <div className={styles.value}>{t(location.captureStatus)}</div>
        </div>
        <div className={styles.singleDetail}>
          <p className={styles.title}>
            {t('coordinates')} <CopyToClipboard text={text} />
          </p>
          <div className={styles.value}>
            <MaterialTextField
              disabled={true}
              variant="outlined"
              value={text}
            />
          </div>
        </div>
        {/* <div className={styles.singleDetail}>
          <p className={styles.title}>{t('guid')}</p>
          <div className={styles.value}>{location.id}</div>
        </div> */}
        {location.measurements && (
          <>
            <div className={styles.singleDetail}>
              <p className={styles.title}>{t('height')}</p>
              <div className={styles.value}>
                {location.measurements?.height}
                {t('m')}
              </div>
            </div>
            <div className={styles.singleDetail}>
              <p className={styles.title}>{t('width')}</p>
              <div className={styles.value}>
                {location.measurements?.width}
                {t('cm')}
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
            <div className={styles.value}>
              <span
                // className={styles.link}
                // onClick={() => router.push(`/[p]`, `/${location.plantProject}`)}
              >
                {location.plantProject}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className={styles.detailsFull}>
        {location.plantedSpecies && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{t('species')}</p>
            <div className={styles.value}>
              <span>
                {location?.plantedSpecies?.map((species: any) => {
                  return (
                    <p key={species.id}>
                      {species.treeCount}{' '}
                      {species.scientificName
                        ? species.scientificName
                        : species.otherSpecies && species.otherSpecies !== 'Unknown'
                        ? species.otherSpecies:
                        t('maps:unknown')}
                    </p>
                  );
                })}
              </span>
            </div>
          </div>
        )}
        {location.type === 'multi' && location.captureMode === 'on-site' && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{t('maps:sampleTree')}</p>
            {/* <div className={styles.value}> */}
            {location.samplePlantLocations &&
              location.samplePlantLocations.map((spl: any, index: number) => {
                return (
                  <div key={index} className={styles.value}>
                    {index + 1}.{' '}
                    <span
                      onClick={() => setselectedLocation(spl)}
                      className={styles.link}
                    >
                      {spl.scientificName
                        ? spl.scientificName
                        : spl.scientificSpecies && spl.scientificSpecies !== 'Unknown'
                        ? spl.scientificSpecies
                        : t('maps:unknown')}
                    </span>
                    <br />
                    {spl.tag ? `${t('maps:tag')} #${spl.tag} • ` : null}
                    {spl?.measurements?.height}
                    {t('maps:meterHigh')} • {spl?.measurements?.width}
                    {t('maps:cmWide')}
                  </div>
                );
              })}
            {/* </div> */}
          </div>
        )}
      </div>
    </>
  );
}
