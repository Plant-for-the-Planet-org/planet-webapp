import type { ReactElement } from 'react';
import type {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import type { SliderImage } from '../../components/PlantLocation/ImageSlider';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../../styles/PlantLocation.module.scss';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import * as turf from '@turf/turf';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import dynamic from 'next/dynamic';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';

const ImageSlider = dynamic(
  () => import('../../components/PlantLocation/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

const ImageSliderSingle = dynamic(
  () => import('../../components/projectDetails/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

interface Props {
  plantLocation: PlantLocation | SamplePlantLocation | null;
}

export default function PlantLocationDetails({
  plantLocation,
}: Props): ReactElement {
  const {
    setSelectedPl,
    plantLocations,
    setSamplePlantLocation,
    setHoveredPl,
  } = useProjectProps();
  const t = useTranslations('Maps');
  const locale = useLocale();
  const [treeCount, setTreeCount] = React.useState(1);
  const [plantationArea, setPlantationArea] = React.useState(0);
  const [sampleTreeImages, setSampleTreeImages] = React.useState<SliderImage[]>(
    []
  );

  React.useEffect(() => {
    let count = 0;
    if (
      plantLocation &&
      plantLocation.type === 'multi-tree-registration' &&
      plantLocation.plantedSpecies
    ) {
      for (const key in plantLocation.plantedSpecies) {
        if (
          Object.prototype.hasOwnProperty.call(
            plantLocation.plantedSpecies,
            key
          )
        ) {
          const element = plantLocation.plantedSpecies[key];
          count += element.treeCount;
        }
      }
      setTreeCount(count);
    }
    if (plantLocation && plantLocation.type === 'multi-tree-registration') {
      const area = turf.area(plantLocation.geometry);
      setPlantationArea(area / 10000);
    }
  }, [plantLocation]);

  React.useEffect(() => {
    if (
      plantLocation &&
      plantLocation.type === 'multi-tree-registration' &&
      plantLocation.sampleInterventions &&
      plantLocation.sampleInterventions.length > 0
    ) {
      const images: SliderImage[] = [];
      for (const key in plantLocation.sampleInterventions) {
        if (
          Object.prototype.hasOwnProperty.call(
            plantLocation.sampleInterventions,
            key
          )
        ) {
          const element = plantLocation.sampleInterventions[key];

          if (element.coordinates?.[0]) {
            images.push({
              image: element.coordinates[0].image || '',
              description: `${t('sampleTree')} ${
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
  }, [plantLocation]);

  const openSampleTree = (id: string) => {
    setHoveredPl(null);
    if (
      plantLocation &&
      plantLocation.type === 'multi-tree-registration' &&
      plantLocation.sampleInterventions
    ) {
      for (const key in plantLocation.sampleInterventions) {
        if (
          Object.prototype.hasOwnProperty.call(
            plantLocation.sampleInterventions,
            key
          )
        ) {
          const element = plantLocation.sampleInterventions[key];

          if (element.id === id) setSamplePlantLocation(element);
        }
      }
    }
  };

  const openParent = (id: string) => {
    if (plantLocations) {
      for (const key in plantLocations) {
        if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
          const element = plantLocations[key];
          if (element.id === id) setSelectedPl(element);
        }
      }
    }
  };

  return (
    <>
      {plantLocation && (
        <div className={'singleProjectDetails'}>
          <div className={styles.treeCount}>
            <div>
              {plantLocation.type === 'multi-tree-registration' && (
                <>
                  <span>
                    {localizedAbbreviatedNumber(locale, Number(treeCount), 1)}{' '}
                    {t('trees')}
                  </span>{' '}
                  (
                  {localizedAbbreviatedNumber(
                    locale,
                    Number(plantationArea),
                    3
                  )}{' '}
                  {t('ha')})
                </>
              )}
              {plantLocation.type === 'single-tree-registration' && (
                <span>{t('1Tree')} </span>
              )}
              {plantLocation.type === 'sample-tree-registration' && (
                <span>{t('sampleTree')} </span>
              )}
            </div>
            <div>
              {plantLocation.hid
                ? plantLocation.hid.substring(0, 3) +
                  '-' +
                  plantLocation.hid.substring(3)
                : null}
            </div>
          </div>
          {plantLocation.type === 'multi-tree-registration' &&
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
          {plantLocation.type !== 'multi-tree-registration' &&
            plantLocation.coordinates?.length > 0 && (
              <div
                className={`${styles.projectImageSliderContainer} ${styles.singlePl}`}
              >
                <ImageSliderSingle
                  images={plantLocation.coordinates}
                  height={233}
                  imageSize="large"
                  type="coordinate"
                />
              </div>
            )}
          <div className={styles.locDetails}>
            <div className={styles.twinDetail}>
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>{t('plantingDate')}</div>
                <div className={styles.detailValue}>
                  {formatDate(plantLocation.plantDate)}
                </div>
              </div>
              {(plantLocation.type === 'sample-tree-registration' ||
                plantLocation.type === 'single-tree-registration') &&
                plantLocation.tag && (
                  <div className={styles.singleDetail}>
                    <div className={styles.detailTitle}>{t('treeTag')}</div>
                    <div className={styles.detailValue}>
                      {t('tag')} #{plantLocation?.tag}
                    </div>
                  </div>
                )}
            </div>

            {plantLocation.type === 'multi-tree-registration' && (
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>
                  {t('plantingDensity')}
                  <div className={styles.popover}>
                    <InfoIcon />
                    <div className={styles.popoverContent}>
                      <p>
                        {t('plantationDensityFormula')}
                        <br />
                        <br />
                        {t('plantingDensityInfo')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.detailValue}>
                  {localizedAbbreviatedNumber(
                    locale,
                    Number(treeCount / plantationArea),
                    1
                  )}{' '}
                  {t('treesPerHa')}
                </div>
              </div>
            )}
            {plantLocation.type === 'multi-tree-registration' &&
              plantLocation.plantedSpecies && (
                <div className={styles.singleDetail}>
                  <div className={styles.detailTitle}>
                    {t('speciesPlanted')} ({plantLocation.plantedSpecies.length}
                    )
                  </div>
                  {plantLocation.plantedSpecies.map((sp, index) => {
                    // const speciesName = getSpeciesName(sp.scientificSpecies);
                    return (
                      <div key={index} className={styles.detailValue}>
                        {sp.treeCount}{' '}
                        <span>
                          {' '}
                          {sp.scientificName ? sp.scientificName : t('unknown')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

            {plantLocation.type === 'multi-tree-registration' && (
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>
                  {t('sampleTrees')} (
                  {plantLocation?.sampleInterventions?.length})
                </div>
                {plantLocation.sampleInterventions &&
                  plantLocation.sampleInterventions.map((spl, index) => {
                    // const speciesName = getSpeciesName(spl.scientificSpecies);
                    return (
                      <div key={index} className={styles.detailValue}>
                        {index + 1}.{' '}
                        <span
                          onClick={() => openSampleTree(spl.id)}
                          className={styles.link}
                        >
                          {spl.scientificName
                            ? spl.scientificName
                            : spl.scientificSpecies
                            ? spl.scientificSpecies
                            : t('unknown')}
                        </span>
                        <br />
                        {spl.tag ? `${t('tag')} #${spl.tag} • ` : null}
                        {spl?.measurements?.height}
                        {t('meterHigh')} • {spl?.measurements?.width}
                        {t('cmWide')}
                      </div>
                    );
                  })}
              </div>
            )}
            {(plantLocation.type === 'sample-tree-registration' ||
              plantLocation.type === 'single-tree-registration') && (
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>{t('scientificName')}</div>
                <div className={styles.detailValue}>
                  <span>
                    {plantLocation.scientificName
                      ? plantLocation.scientificName
                      : plantLocation.scientificSpecies
                      ? plantLocation.scientificSpecies
                      : t('unknown')}
                  </span>
                </div>
              </div>
            )}
            {(plantLocation.type === 'sample-tree-registration' ||
              plantLocation.type === 'single-tree-registration') &&
              plantLocation.measurements && (
                <div className={styles.singleDetail}>
                  <div className={styles.detailTitle}>{t('measurements')}</div>
                  <div className={styles.detailValue}>
                    {plantLocation?.measurements?.height}
                    {t('meterHigh')} • {plantLocation?.measurements?.width}
                    {t('cmWide')}
                  </div>
                </div>
              )}

            {plantLocation.type === 'sample-tree-registration' &&
              plantLocation.parent && (
                <div className={styles.singleDetail}>
                  <div className={styles.detailTitle}>{t('plot')}</div>
                  <div className={styles.detailValue}>
                    <span
                      onClick={() => openParent(plantLocation.parent)}
                      className={styles.link}
                    >
                      {t('showWholeArea')}
                    </span>
                  </div>
                </div>
              )}
            {/* <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>Recruits (per HA)</div>
                <div className={styles.detailValue}>710,421</div>
              </div> */}
            <div className={styles.footer}>
              <div className={styles.detailValue}>
                Powered by{' '}
                <a
                  href="https://treemapper.app"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t('treeMapper')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
