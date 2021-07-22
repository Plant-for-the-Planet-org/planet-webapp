import React, { ReactElement } from 'react';
import i18next from '../../../../i18n';
import styles from '../styles/PlantLocation.module.scss';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import * as turf from '@turf/turf';
import formatDate from '../../../utils/countryCurrency/getFormattedDate';
import dynamic from 'next/dynamic';

const ImageSlider = dynamic(
  () => import('../components/projectDetails/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

const { useTranslation } = i18next;

interface Props {
  plantLocation: Object;
}

export default function SinglePlantLocation({
  plantLocation,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['maps']);
  const [treeCount, setTreeCount] = React.useState(1);
  const [plantationArea, setPlantationArea] = React.useState(0);

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
          {plantLocation?.coordinates &&
            plantLocation?.coordinates.length !== 0 && (
              <ImageSlider
                images={plantLocation.coordinates}
                show={plantLocation}
                height={233}
                imageSize="large"
                type="coordinate"
              />
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
            {/* <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>Recruits (per HA)</div>
                <div className={styles.detailValue}>710,421</div>
              </div> */}
          </div>
        </div>
      )}
    </>
  );
}
