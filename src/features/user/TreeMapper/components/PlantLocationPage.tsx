import React, { ReactElement } from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import styles from '../TreeMapper.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import CopyToClipboard from '../../../common/CopyToClipboard';
import {
  PlantLocation,
  PlantLocationMulti,
  PlantLocationSingle,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import { SetState } from '../../../common/types/common';

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

interface Props {
  setSelectedLocation: SetState<
    SamplePlantLocation | PlantLocationMulti | PlantLocationSingle | null
  >;
  location:
    | PlantLocationMulti
    | PlantLocationSingle
    | SamplePlantLocation
    | null;
  plantLocations?: PlantLocation[];
}

interface SampleTreeImageProps {
  image: string | undefined;
  description: string | undefined;
}

export function LocationDetails({
  location,
  setSelectedLocation,
}: Props): ReactElement {
  const tTreemapper = useTranslations('Treemapper');
  const tMaps = useTranslations('Maps');
  const locale = useLocale();
  const [sampleTreeImages, setSampleTreeImages] = React.useState<
    SampleTreeImageProps[]
  >([]);

  const text = `${location?.deviceLocation?.coordinates.map((coord) => {
    return getFormattedNumber(locale, Number(coord));
  })}`;

  React.useEffect(() => {
    if (location?.type === 'multi-tree-registration') {
      if (
        location &&
        (location as PlantLocationMulti).sampleInterventions &&
        (location as PlantLocationMulti).sampleInterventions.length > 0
      ) {
        const images = [];
        for (const key in (location as PlantLocationMulti)
          .sampleInterventions) {
          if (
            Object.prototype.hasOwnProperty.call(
              (location as PlantLocationMulti).sampleInterventions,
              key
            )
          ) {
            const element = (location as PlantLocationMulti)
              .sampleInterventions[key];

            if (element.coordinates?.[0]) {
              images.push({
                image: element.coordinates[0].image,
                description: `${tMaps('sampleTree')} ${
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
    }
  }, [location]);
  return location ? (
    <>
      {location.type === 'multi-tree-registration' &&
        sampleTreeImages.length > 0 && (
          <div className={styles.projectImageSliderContainer}>
            <ImageSlider
              images={sampleTreeImages}
              height={233}
              imageSize="large"
              type="coordinate"
            />
          </div>
        )}
      {location.type !== 'multi-tree-registration' &&
        location.coordinates?.length > 0 && (
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
          <p className={styles.title}>{tTreemapper('captureMode')}</p>
          <div className={styles.value}>
            {tTreemapper(location.captureMode)}
          </div>
        </div>
        <div className={styles.singleDetail}>
          <p className={styles.title}>{tTreemapper('captureStatus')}</p>
          <div className={styles.value}>
            {tTreemapper(location.captureStatus)}
          </div>
        </div>
        {/* <div className={styles.singleDetail}>
              <p className={styles.title}>{tTreemapper('guid')}</p>
              <div className={styles.value}>{location.id}</div>
            </div> */}
        {location?.deviceLocation ? (
          <div className={styles.rowDetail}>
            <div className={styles.singleDetail}>
              <p className={styles.title}>
                {tTreemapper('coordinates')} <CopyToClipboard text={text} />
              </p>
              <div className={styles.value}>{text.split(',').join(', ')}</div>
            </div>
          </div>
        ) : (
          []
        )}
        {location.interventionStartDate !== null && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('plantDate')}</p>
            <div className={styles.value}>
              {formatDate(location.interventionStartDate)}
            </div>
          </div>
        )}
        <div className={styles.singleDetail}>
          <p className={styles.title}>{tTreemapper('registrationDate')}</p>
          <div className={styles.value}>
            {formatDate(location.registrationDate)}
          </div>
        </div>
        {(location as PlantLocationSingle).measurements && (
          <>
            <div className={styles.measurements}>
              <div className={styles.singleDetail}>
                <p className={styles.title}>{tTreemapper('measurements')}</p>
              </div>
            </div>
            <div className={styles.measurements}>
              <div className={styles.singleDetail}>
                <p className={styles.title}>{tTreemapper('date')}</p>
                {location.history?.map((h, index) => (
                  <div className={styles.value} key={index}>
                    {formatDate(h?.created)}
                  </div>
                ))}
              </div>
              <div className={styles.singleDetail}>
                <p className={styles.title}>{tTreemapper('height')}</p>
                {location.history?.map((h, index) => (
                  <div className={styles.value} key={index}>
                    {h?.measurements?.height} {tTreemapper('m')}
                  </div>
                ))}
              </div>
              <div className={styles.singleDetail}>
                <p className={styles.title}>{tTreemapper('width')}</p>
                {location.history?.map((h, index) => (
                  <div className={styles.value} key={index}>
                    {h?.measurements?.width} {tTreemapper('cm')}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {(location as PlantLocationMulti | PlantLocation).plantProject && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('plantProject')}</p>
            <div className={styles.value}>
              <span
              // className={styles.link}
              // onClick={() => router.push(`/[p]`, `/${location.plantProject}`)}
              >
                {(location as PlantLocationMulti | PlantLocation).plantProject}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className={styles.detailsFull}>
        {(location as PlantLocationMulti)?.plantedSpecies && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('species')}</p>
            <div className={styles.value}>
              <span>
                {(location as PlantLocationMulti)?.plantedSpecies?.map(
                  (species) => {
                    return (
                      <p key={species.id}>
                        {species.treeCount}{' '}
                        {species.scientificName
                          ? species.scientificName
                          : species.otherSpecies &&
                            species.otherSpecies !== 'Unknown'
                          ? species.otherSpecies
                          : tMaps('unknown')}
                      </p>
                    );
                  }
                )}
              </span>
            </div>
          </div>
        )}
        {location.type === 'multi-tree-registration' &&
          location.captureMode === 'on-site' && (
            <div className={styles.singleDetail}>
              <p className={styles.title}>{tMaps('sampleTree')}</p>
              {/* <div className={styles.value}> */}
              {(location as PlantLocationMulti).sampleInterventions &&
                (location as PlantLocationMulti).sampleInterventions.map(
                  (spl, index: number) => {
                    return (
                      <div key={index} className={styles.value}>
                        {index + 1}.{' '}
                        <span
                          onClick={() => setSelectedLocation(spl)}
                          className={styles.link}
                        >
                          {spl.scientificName
                            ? spl.scientificName
                            : spl.scientificSpecies &&
                              spl.scientificSpecies !== 'Unknown'
                            ? spl.scientificSpecies
                            : tMaps('unknown')}
                        </span>
                        <br />
                        {spl.tag ? `${tMaps('tag')} #${spl.tag} • ` : null}
                        {spl?.measurements?.height}
                        {tMaps('meterHigh')} • {spl?.measurements?.width}
                        {tMaps('cmWide')}
                      </div>
                    );
                  }
                )}
              {/* </div> */}
            </div>
          )}
      </div>
    </>
  ) : (
    <></>
  );
}

export default function PlantLocationPage({
  location,
  setSelectedLocation,
  plantLocations,
}: Props): ReactElement {
  const router = useRouter();

  const handleBackButton = () => {
    if (location?.type === 'sample-tree-registration') {
      for (const iKey in plantLocations) {
        const i = iKey as keyof typeof plantLocations;
        if (Object.prototype.hasOwnProperty.call(plantLocations, i)) {
          const pl = plantLocations[i] as PlantLocation;
          if (pl.id === (location as SamplePlantLocation)?.parent) {
            setSelectedLocation(pl);
            break;
          }
        }
      }
    } else {
      router.replace('/profile/treemapper');
    }
  };

  const DetailProps = {
    location,
    setSelectedLocation,
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
