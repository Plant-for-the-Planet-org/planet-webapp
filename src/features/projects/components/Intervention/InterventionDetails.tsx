import type { ReactElement } from 'react';
import type {
  Intervention,
  SampleIntervention,
} from '../../../common/types/intervention';
import type { SliderImage } from './ImageSlider';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../../styles/Intervention.module.scss';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import * as turf from '@turf/turf';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import dynamic from 'next/dynamic';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';

const ImageSlider = dynamic(() => import('./ImageSlider'), {
  ssr: false,
  loading: () => <p>Images</p>,
});

const ImageSliderSingle = dynamic(
  () => import('../projectDetails/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

interface Props {
  activeIntervention: Intervention | SampleIntervention | null;
}

export default function InterventionDetails({
  activeIntervention,
}: Props): ReactElement {
  const { setSelectedPl, interventions, setSampleIntervention, setHoveredPl } =
    useProjectProps();
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
      activeIntervention &&
      activeIntervention.type === 'multi-tree-registration' &&
      activeIntervention.plantedSpecies
    ) {
      for (const key in activeIntervention.plantedSpecies) {
        if (
          Object.prototype.hasOwnProperty.call(
            activeIntervention.plantedSpecies,
            key
          )
        ) {
          const element = activeIntervention.plantedSpecies[key];
          count += element.treeCount;
        }
      }
      setTreeCount(count);
    }
    if (
      activeIntervention &&
      activeIntervention.type === 'multi-tree-registration'
    ) {
      const area = turf.area(activeIntervention.geometry);
      setPlantationArea(area / 10000);
    }
  }, [activeIntervention]);

  React.useEffect(() => {
    if (
      activeIntervention &&
      activeIntervention.type === 'multi-tree-registration' &&
      activeIntervention.sampleInterventions &&
      activeIntervention.sampleInterventions.length > 0
    ) {
      const images: SliderImage[] = [];
      for (const key in activeIntervention.sampleInterventions) {
        if (
          Object.prototype.hasOwnProperty.call(
            activeIntervention.sampleInterventions,
            key
          )
        ) {
          const element = activeIntervention.sampleInterventions[key];

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
  }, [activeIntervention]);

  const openSampleTree = (id: string) => {
    setHoveredPl(null);
    if (
      activeIntervention &&
      activeIntervention.type === 'multi-tree-registration' &&
      activeIntervention.sampleInterventions
    ) {
      for (const key in activeIntervention.sampleInterventions) {
        if (
          Object.prototype.hasOwnProperty.call(
            activeIntervention.sampleInterventions,
            key
          )
        ) {
          const element = activeIntervention.sampleInterventions[key];

          if (element.id === id) setSampleIntervention(element);
        }
      }
    }
  };

  const openParent = (id: string) => {
    if (interventions) {
      for (const key in interventions) {
        if (Object.prototype.hasOwnProperty.call(interventions, key)) {
          const element = interventions[key];
          if (element.id === id) setSelectedPl(element);
        }
      }
    }
  };

  return (
    <>
      {activeIntervention && (
        <div className={'singleProjectDetails'}>
          <div className={styles.treeCount}>
            <div>
              {activeIntervention.type === 'multi-tree-registration' && (
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
              {activeIntervention.type === 'single-tree-registration' && (
                <span>{t('1Tree')} </span>
              )}
              {activeIntervention.type === 'sample-tree-registration' && (
                <span>{t('sampleTree')} </span>
              )}
            </div>
            <div>
              {activeIntervention.hid
                ? activeIntervention.hid.substring(0, 3) +
                  '-' +
                  activeIntervention.hid.substring(3)
                : null}
            </div>
          </div>
          {activeIntervention.type === 'multi-tree-registration' &&
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
          {activeIntervention.type !== 'multi-tree-registration' &&
            activeIntervention.coordinates?.length > 0 && (
              <div
                className={`${styles.projectImageSliderContainer} ${styles.singlePl}`}
              >
                <ImageSliderSingle
                  images={activeIntervention.coordinates}
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
                  {formatDate(activeIntervention.plantDate)}
                </div>
              </div>
              {(activeIntervention.type === 'sample-tree-registration' ||
                activeIntervention.type === 'single-tree-registration') &&
                activeIntervention.tag && (
                  <div className={styles.singleDetail}>
                    <div className={styles.detailTitle}>{t('treeTag')}</div>
                    <div className={styles.detailValue}>
                      {t('tag')} #{activeIntervention?.tag}
                    </div>
                  </div>
                )}
            </div>

            {activeIntervention.type === 'multi-tree-registration' && (
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
            {activeIntervention.type === 'multi-tree-registration' &&
              activeIntervention.plantedSpecies && (
                <div className={styles.singleDetail}>
                  <div className={styles.detailTitle}>
                    {t('speciesPlanted')} (
                    {activeIntervention.plantedSpecies.length})
                  </div>
                  {activeIntervention.plantedSpecies.map((sp, index) => {
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

            {activeIntervention.type === 'multi-tree-registration' && (
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>
                  {t('sampleTrees')} (
                  {activeIntervention?.sampleInterventions?.length})
                </div>
                {activeIntervention.sampleInterventions &&
                  activeIntervention.sampleInterventions.map((spl, index) => {
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
            {(activeIntervention.type === 'sample-tree-registration' ||
              activeIntervention.type === 'single-tree-registration') && (
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>{t('scientificName')}</div>
                <div className={styles.detailValue}>
                  <span>
                    {activeIntervention.scientificName
                      ? activeIntervention.scientificName
                      : activeIntervention.scientificSpecies
                      ? activeIntervention.scientificSpecies
                      : t('unknown')}
                  </span>
                </div>
              </div>
            )}
            {(activeIntervention.type === 'sample-tree-registration' ||
              activeIntervention.type === 'single-tree-registration') &&
              activeIntervention.measurements && (
                <div className={styles.singleDetail}>
                  <div className={styles.detailTitle}>{t('measurements')}</div>
                  <div className={styles.detailValue}>
                    {activeIntervention?.measurements?.height}
                    {t('meterHigh')} • {activeIntervention?.measurements?.width}
                    {t('cmWide')}
                  </div>
                </div>
              )}

            {activeIntervention.type === 'sample-tree-registration' &&
              activeIntervention.parent && (
                <div className={styles.singleDetail}>
                  <div className={styles.detailTitle}>{t('plot')}</div>
                  <div className={styles.detailValue}>
                    <span
                      onClick={() => openParent(activeIntervention.parent)}
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
