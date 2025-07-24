import type { ReactElement } from 'react';
import type {
  Intervention,
  InterventionMulti,
  InterventionSingle,
  SampleIntervention,
} from '../../../common/types/intervention';
import type { SetState } from '../../../common/types/common';

import React from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import styles from '../TreeMapper.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import CopyToClipboard from '../../../common/CopyToClipboard';

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
    SampleIntervention | InterventionMulti | InterventionSingle | null
  >;
  location: InterventionMulti | InterventionSingle | SampleIntervention | null;
  plantLocations?: Intervention[];
}

interface SampleTreeImageProps {
  image: string | undefined;
  description: string | undefined;
}

export function LocationDetails({
  location,
  setSelectedLocation,
}: Props): ReactElement {
  if (!location) return <></>;
  const tTreemapper = useTranslations('Treemapper');
  const tMaps = useTranslations('Maps');
  const locale = useLocale();
  const [sampleTreeImages, setSampleTreeImages] = React.useState<
    SampleTreeImageProps[]
  >([]);

  const text = `${location?.deviceLocation?.coordinates.map((coord) => {
    return getFormattedNumber(locale, Number(coord));
  })}`;

  const deadPlant = location.history.filter((item) => item.status === 'dead');
  const alivePlant = location.history.filter((item) => item.status !== 'dead');

  const plantDate =
    location.interventionStartDate ||
    location.plantDate ||
    location.registrationDate;
  const isPlantDead = location.status === 'dead';
  const hasPlantingHistory = location.history.length > 0;
  const shouldShowPlantStatus = deadPlant.length > 0 || isPlantDead;

  const renderMeasurementValue = (
    value: number | undefined,
    unit: 'm' | 'cm'
  ) => (
    <div className={styles.value}>
      {value}
      {tTreemapper(unit)}
    </div>
  );

  const renderHistoryValues = (
    history: typeof location.history,
    key: 'height' | 'width',
    unit: 'm' | 'cm'
  ) =>
    history.map((h, index) => (
      <div className={styles.value} key={`${key}-${index}`}>
        {h.status === 'dead'
          ? '-'
          : `${h.measurements?.[key] ?? '-'}${tTreemapper(unit)}`}
      </div>
    ));

  const renderHistoryDates = (history: typeof location.history) =>
    history.map((h, index) => (
      <div className={styles.value} key={`date-${index}`}>
        {formatDate(h.eventDate as Date)}
      </div>
    ));

  const renderStatusValues = (
    history: typeof location.history,
    key: 'status' | 'statusReason'
  ) =>
    history.map((h, index) => (
      <div className={styles.value} key={`${key}-${index}`}>
        {h[key]}
      </div>
    ));

  React.useEffect(() => {
    if (location?.type === 'multi-tree-registration') {
      if (
        location &&
        (location as InterventionMulti).sampleInterventions &&
        (location as InterventionMulti).sampleInterventions.length > 0
      ) {
        const images = [];
        for (const key in (location as InterventionMulti).sampleInterventions) {
          if (
            Object.prototype.hasOwnProperty.call(
              (location as InterventionMulti).sampleInterventions,
              key
            )
          ) {
            const element = (location as InterventionMulti).sampleInterventions[
              key
            ];

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
  return (
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
        {location.captureMode && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('captureMode')}</p>
            <div className={styles.value}>
              {tTreemapper(location.captureMode)}
            </div>
          </div>
        )}

        {location.captureStatus && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('captureStatus')}</p>
            <div className={styles.value}>
              {tTreemapper(location.captureStatus)}
            </div>
          </div>
        )}

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
        {plantDate && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('plantDate')}</p>
            <div className={styles.value}>{formatDate(plantDate)}</div>
          </div>
        )}
        {location.registrationDate && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('registrationDate')}</p>
            <div className={styles.value}>
              {formatDate(location.registrationDate)}
            </div>
          </div>
        )}
        {(location as InterventionSingle).measurements && (
          <>
            {/* Measurements Section */}
            <div className={styles.measurements}>
              <div className={styles.singleDetail}>
                <p className={styles.title}>{tTreemapper('measurements')}</p>
              </div>
            </div>

            <div className={styles.measurements}>
              {/* Planting Date */}
              <div className={styles.singleDetail}>
                <p className={styles.title}>{tTreemapper('date')}</p>
                {!isPlantDead && (
                  <div className={styles.value}>{formatDate(plantDate)}</div>
                )}
                {hasPlantingHistory && renderHistoryDates(alivePlant)}
              </div>

              {/* Height */}
              <div className={styles.singleDetail}>
                <p className={styles.title}>{tTreemapper('height')}</p>
                {!isPlantDead &&
                  renderMeasurementValue(location.measurements?.height, 'm')}
                {hasPlantingHistory &&
                  renderHistoryValues(alivePlant, 'height', 'm')}
              </div>

              {/* Width */}
              <div className={styles.singleDetail}>
                <p className={styles.title}>{tTreemapper('width')}</p>
                {!isPlantDead &&
                  renderMeasurementValue(location.measurements?.width, 'cm')}
                {hasPlantingHistory &&
                  renderHistoryValues(alivePlant, 'width', 'cm')}
              </div>
            </div>

            {/* Plant Status Section */}
            {shouldShowPlantStatus && (
              <>
                <div className={styles.singleDetail}>
                  <p className={styles.title}>{tTreemapper('plantStatus')}</p>
                </div>
                <div className={styles.measurements}>
                  <div className={styles.singleDetail}>
                    <p className={styles.title}>{tTreemapper('date')}</p>
                    {isPlantDead && (
                      <div className={styles.value}>
                        {formatDate(plantDate)}
                      </div>
                    )}
                    {hasPlantingHistory && renderHistoryDates(deadPlant)}
                  </div>

                  {/*Plant dead Status */}
                  <div className={styles.singleDetail}>
                    <p className={styles.title}>{tTreemapper('status')}</p>
                    {isPlantDead && (
                      <div className={styles.value}>{location.status}</div>
                    )}
                    {hasPlantingHistory &&
                      renderStatusValues(deadPlant, 'status')}
                  </div>

                  {/* Plant dead Reason */}
                  <div className={styles.singleDetail}>
                    <p className={styles.title}>{tTreemapper('reason')}</p>
                    {isPlantDead && (
                      <div className={styles.value}>
                        {location.statusReason}
                      </div>
                    )}
                    {hasPlantingHistory &&
                      renderStatusValues(deadPlant, 'statusReason')}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {(location as InterventionMulti | Intervention).plantProject && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('plantProject')}</p>
            <div className={styles.value}>
              <span
              // className={styles.link}
              // onClick={() => router.push(`/[p]`, `/${location.plantProject}`)}
              >
                {(location as InterventionMulti | Intervention).plantProject}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className={styles.detailsFull}>
        {(location as InterventionMulti)?.plantedSpecies.length > 0 && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('species')}</p>
            <div className={styles.value}>
              <span>
                {(location as InterventionMulti)?.plantedSpecies?.map(
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
              {(location as InterventionMulti).sampleInterventions &&
                (location as InterventionMulti).sampleInterventions.map(
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
          const pl = plantLocations[i] as Intervention;
          if (pl.id === (location as SampleIntervention)?.parent) {
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
