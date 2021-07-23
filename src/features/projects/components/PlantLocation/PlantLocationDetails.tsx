import React, { ReactElement } from 'react';
import i18next from '../../../../../i18n';
import styles from '../../styles/PlantLocation.module.scss';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import * as turf from '@turf/turf';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import dynamic from 'next/dynamic';

const ImageSlider = dynamic(
  () => import('../../components/projectDetails/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

const { useTranslation } = i18next;

interface Props {
  plantLocation: Object;
}

export default function PlantLocationDetails({
  plantLocation,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['maps']);
  const [treeCount, setTreeCount] = React.useState(1);
  const [plantationArea, setPlantationArea] = React.useState(0);
  const [sampleTreeImages, setSampleTreeImages] = React.useState([]);

  React.useEffect(() => {
    let count = 0;
    if (plantLocation && plantLocation.plantedSpecies) {
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
    if (plantLocation && plantLocation.type === 'multi') {
      const area = turf.area(plantLocation.geometry);
      setPlantationArea(area / 10000);
    }
  }, [plantLocation]);

  React.useEffect(() => {
    if (
      plantLocation &&
      plantLocation.samplePlantLocations &&
      plantLocation.samplePlantLocations.length > 0
    ) {
      let images = [];
      for (const key in plantLocation.samplePlantLocations) {
        if (
          Object.prototype.hasOwnProperty.call(
            plantLocation.samplePlantLocations,
            key
          )
        ) {
          const element = plantLocation.samplePlantLocations[key];

          if (element.coordinates?.[0]) {
            images.push(element.coordinates[0]);
          }
        }
      }
      setSampleTreeImages(images);
    } else {
      setSampleTreeImages([]);
    }
  }, [plantLocation]);

  return (
    <>
      {plantLocation && (
        <div className={'singleProjectDetails'}>
          <div className={styles.treeCount}>
            {plantLocation.type === 'multi' && (
              <>
                <span>
                  {localizedAbbreviatedNumber(
                    i18n.language,
                    Number(treeCount),
                    1
                  )}{' '}
                  {t('trees')}
                </span>{' '}
                (
                {localizedAbbreviatedNumber(
                  i18n.language,
                  Number(plantationArea),
                  3
                )}{' '}
                {t('ha')})
              </>
            )}
            {plantLocation.type === 'single' && <span>{t('1Tree')} </span>}
            {plantLocation.type === 'sample' && <span>{t('sampleTree')} </span>}
          </div>
          {plantLocation.type === 'multi' && sampleTreeImages.length > 0 && (
            <div className={styles.projectImageSliderContainer}>
              <ImageSlider
                images={sampleTreeImages}
                height={233}
                imageSize="large"
                type="coordinate"
              />
            </div>
          )}
          {plantLocation.type !== 'multi' &&
            plantLocation.coordinates?.length > 0 && (
              <div
                className={`${styles.projectImageSliderContainer} ${styles.singlePl}`}
              >
                <ImageSlider
                  images={plantLocation.coordinates}
                  height={233}
                  imageSize="large"
                  type="coordinate"
                />
              </div>
            )}
          <div className={styles.locDetails}>
            <div className={styles.singleDetail}>
              <div className={styles.detailTitle}>{t('plantingDate')}</div>
              <div className={styles.detailValue}>
                {formatDate(plantLocation.plantDate)}
              </div>
            </div>
            {plantLocation.type === 'multi' && (
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>{t('plantingDensity')}</div>
                <div className={styles.detailValue}>
                  {localizedAbbreviatedNumber(
                    i18n.language,
                    Number(treeCount / plantationArea),
                    1
                  )}{' '}
                  {t('treesPerHa')}
                </div>
              </div>
            )}
            {plantLocation.type === 'multi' && plantLocation.plantedSpecies && (
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>
                  {t('speciesPlanted')} ({plantLocation.plantedSpecies.length})
                </div>
                {plantLocation.plantedSpecies.map((sp: any, index: number) => {
                  // const speciesName = getSpeciesName(sp.scientificSpecies);
                  return (
                    <div key={index} className={styles.detailValue}>
                      {sp.treeCount}{' '}
                      <span>
                        {' '}
                        {sp.scientificName
                          ? sp.scientificName
                          : sp.scientificSpecies}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {plantLocation.type === 'multi' && (
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>
                  {t('treesSampled')} (
                  {plantLocation?.samplePlantLocations?.length})
                </div>
                {plantLocation.samplePlantLocations &&
                  plantLocation.samplePlantLocations.map(
                    (spl: any, index: number) => {
                      // const speciesName = getSpeciesName(spl.scientificSpecies);
                      return (
                        <div key={index} className={styles.detailValue}>
                          {index + 1}.{' '}
                          <span>
                            {spl.scientificName
                              ? spl.scientificName
                              : spl.scientificSpecies}
                          </span>
                          <br />#{spl?.tag} • {spl?.measurements?.height}
                          {t('meterHigh')}• {spl?.measurements?.width}
                          {t('cmWide')}
                        </div>
                      );
                    }
                  )}
              </div>
            )}
            {(plantLocation.type === 'sample' ||
              plantLocation.type === 'single') && (
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>{t('scientificName')}</div>
                <div className={styles.detailValue}>
                  <span>
                    {plantLocation.scientificName
                      ? plantLocation.scientificName
                      : plantLocation.scientificSpecies}
                  </span>
                </div>
              </div>
            )}
            {(plantLocation.type === 'sample' ||
              plantLocation.type === 'single') &&
              plantLocation.measurements && (
                <div className={styles.singleDetail}>
                  <div className={styles.detailTitle}>{t('measurements')}</div>
                  <div className={styles.detailValue}>
                    {plantLocation?.measurements?.height}
                    {t('meterHigh')}• {plantLocation?.measurements?.width}
                    {t('cmWide')}
                  </div>
                </div>
              )}

            {(plantLocation.type === 'sample' ||
              plantLocation.type === 'single') &&
              plantLocation.tag && (
                <div className={styles.singleDetail}>
                  <div className={styles.detailTitle}>{t('treeTag')}</div>
                  <div className={styles.detailValue}>
                    #{plantLocation?.tag}
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
                  Tree Mapper
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
