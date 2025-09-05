import type { ReactElement } from 'react';
import type {
  Intervention,
  MultiTreeRegistration,
  SampleTreeRegistration,
} from '../../../common/types/intervention';
import type { SetState } from '../../../common/types/common';

import { useEffect, useState } from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import styles from '../TreeMapper.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import dynamic from 'next/dynamic';
import CopyToClipboard from '../../../common/CopyToClipboard';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

const ImageSlider = dynamic(
  () => import('../../../projects/components/Intervention/ImageSlider'),
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
  setSelectedIntervention: SetState<
    Intervention | SampleTreeRegistration | null
  >;
  selectedIntervention: Intervention | SampleTreeRegistration | null;
  interventions?: Intervention[];
}

interface SampleTreeImageProps {
  image: string | undefined;
  description: string | undefined;
}

export function InterventionInfo({
  selectedIntervention,
  setSelectedIntervention,
}: Props): ReactElement {
  if (!selectedIntervention) return <></>;
  const tTreemapper = useTranslations('Treemapper');
  const tMaps = useTranslations('Maps');
  const locale = useLocale();
  const [sampleTreeImages, setSampleTreeImages] = useState<
    SampleTreeImageProps[]
  >([]);

  const text = `${selectedIntervention?.deviceLocation?.coordinates.map(
    (coord) => {
      return getFormattedNumber(locale, Number(coord));
    }
  )}`;

  const deadPlant = selectedIntervention.history.filter(
    (item) => item.status === 'dead'
  );
  const alivePlant = selectedIntervention.history.filter(
    (item) => item.status !== 'dead'
  );

  const plantDate =
    selectedIntervention.interventionStartDate ||
    selectedIntervention.plantDate ||
    selectedIntervention.registrationDate;
  const isPlantDead = selectedIntervention.status === 'dead';
  const hasPlantingHistory = selectedIntervention.history.length > 0;
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
    history: typeof selectedIntervention.history,
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

  const renderHistoryDates = (history: typeof selectedIntervention.history) =>
    history.map((h, index) => (
      <div className={styles.value} key={`date-${index}`}>
        {formatDate(h.eventDate as Date)}
      </div>
    ));

  const renderStatusValues = (
    history: typeof selectedIntervention.history,
    key: 'status' | 'statusReason'
  ) =>
    history.map((h, index) => (
      <div className={styles.value} key={`${key}-${index}`}>
        {h[key]}
      </div>
    ));

  useEffect(() => {
    if (selectedIntervention?.type === 'multi-tree-registration') {
      if (
        selectedIntervention &&
        selectedIntervention.sampleInterventions &&
        selectedIntervention.sampleInterventions.length > 0
      ) {
        const images = [];
        for (const key in selectedIntervention.sampleInterventions) {
          if (
            Object.prototype.hasOwnProperty.call(
              selectedIntervention.sampleInterventions,
              key
            )
          ) {
            const element = selectedIntervention.sampleInterventions[key];

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
  }, [selectedIntervention]);
  return (
    <>
      {selectedIntervention.type === 'multi-tree-registration' &&
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
      {selectedIntervention.type !== 'multi-tree-registration' &&
        selectedIntervention.coordinates?.length > 0 && (
          <div className={`${styles.projectImageSliderContainer}`}>
            <ImageSliderSingle
              images={selectedIntervention.coordinates}
              height={233}
              imageSize="large"
              type="coordinate"
            />
          </div>
        )}
      <div className={styles.details}>
        {selectedIntervention.captureMode && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('captureMode')}</p>
            <div className={styles.value}>
              {tTreemapper(selectedIntervention.captureMode)}
            </div>
          </div>
        )}

        {selectedIntervention.captureStatus && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('captureStatus')}</p>
            <div className={styles.value}>
              {tTreemapper(selectedIntervention.captureStatus)}
            </div>
          </div>
        )}

        {selectedIntervention?.deviceLocation ? (
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
        {selectedIntervention.registrationDate && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('registrationDate')}</p>
            <div className={styles.value}>
              {formatDate(selectedIntervention.registrationDate)}
            </div>
          </div>
        )}
        {selectedIntervention.type === 'single-tree-registration' && (
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
                  renderMeasurementValue(
                    selectedIntervention.measurements?.height,
                    'm'
                  )}
                {hasPlantingHistory &&
                  renderHistoryValues(alivePlant, 'height', 'm')}
              </div>

              {/* Width */}
              <div className={styles.singleDetail}>
                <p className={styles.title}>{tTreemapper('width')}</p>
                {!isPlantDead &&
                  renderMeasurementValue(
                    selectedIntervention.measurements?.width,
                    'cm'
                  )}
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
                      <div className={styles.value}>
                        {selectedIntervention.status}
                      </div>
                    )}
                    {hasPlantingHistory &&
                      renderStatusValues(deadPlant, 'status')}
                  </div>

                  {/* Plant dead Reason */}
                  <div className={styles.singleDetail}>
                    <p className={styles.title}>{tTreemapper('reason')}</p>
                    {isPlantDead && (
                      <div className={styles.value}>
                        {selectedIntervention.statusReason}
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

        {selectedIntervention.plantProject && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('plantProject')}</p>
            <div className={styles.value}>
              <span>{selectedIntervention.plantProject}</span>
            </div>
          </div>
        )}
      </div>
      <div className={styles.detailsFull}>
        {(selectedIntervention as MultiTreeRegistration)?.plantedSpecies
          .length > 0 && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{tTreemapper('species')}</p>
            <div className={styles.value}>
              <span>
                {(
                  selectedIntervention as MultiTreeRegistration
                )?.plantedSpecies?.map((species) => {
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
                })}
              </span>
            </div>
          </div>
        )}
        {selectedIntervention.type === 'multi-tree-registration' &&
          selectedIntervention.captureMode === 'on-site' && (
            <div className={styles.singleDetail}>
              <p className={styles.title}>{tMaps('sampleTree')}</p>
              {selectedIntervention.sampleInterventions.map(
                (str, index: number) => {
                  //str -> sample tree registration
                  return (
                    <div key={index} className={styles.value}>
                      {index + 1}.{' '}
                      <span
                        onClick={() => setSelectedIntervention(str)}
                        className={styles.link}
                      >
                        {str.scientificName
                          ? str.scientificName
                          : str.scientificSpecies &&
                            str.scientificSpecies !== 'Unknown'
                          ? str.scientificSpecies
                          : tMaps('unknown')}
                      </span>
                      <br />
                      {str.tag ? `${tMaps('tag')} #${str.tag} • ` : null}
                      {str?.measurements?.height}
                      {tMaps('meterHigh')} • {str?.measurements?.width}
                      {tMaps('cmWide')}
                    </div>
                  );
                }
              )}
            </div>
          )}
      </div>
    </>
  );
}

export default function InterventionPage({
  selectedIntervention,
  setSelectedIntervention,
  interventions,
}: Props): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const handleBackButton = () => {
    if (selectedIntervention?.type === 'sample-tree-registration') {
      for (const iKey in interventions) {
        const i = iKey as keyof typeof interventions;
        if (Object.prototype.hasOwnProperty.call(interventions, i)) {
          const multiTreeRegistration = interventions[i] as Intervention;
          if (multiTreeRegistration.id === selectedIntervention?.parent) {
            setSelectedIntervention(multiTreeRegistration);
            break;
          }
        }
      }
    } else {
      router.replace(localizedPath('/profile/treemapper'));
    }
  };

  const DetailProps = {
    selectedIntervention,
    setSelectedIntervention,
  };

  return (
    <div className={styles.locationDetails}>
      <div className={styles.locationNav}>
        <div onClick={handleBackButton} className={styles.backButton}>
          <BackButton />
        </div>
        <div className={styles.locationMenu} />
      </div>

      <InterventionInfo {...DetailProps} />
    </div>
  );
}
