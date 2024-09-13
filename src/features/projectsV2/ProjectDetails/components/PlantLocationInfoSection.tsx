import { useMemo } from 'react';
import * as turf from '@turf/turf';
import { useLocale, useTranslations } from 'next-intl';
import {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import styles from '../styles/PlantLocationInfo.module.scss';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { extractImages } from '../utils';
import ImagesSlider from './ImagesSlider';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import TreeMapperIcon from '../../../../../public/assets/images/icons/projectV2/TreeMapperIcon';

const PlantLocationInfoSection = ({
  plantLocationInfo,
}: {
  plantLocationInfo: PlantLocation | SamplePlantLocation | null;
}) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();

  const { totalTreesCount, plantLocationArea } = useMemo(() => {
    const totalTreesCount =
      plantLocationInfo?.type === 'multi-tree-registration'
        ? plantLocationInfo.plantedSpecies.reduce(
            (sum, species) => sum + species.treeCount,
            0
          )
        : 0;
    const area = plantLocationInfo?.geometry
      ? turf.area(plantLocationInfo?.geometry)
      : 0;
    const plantLocationArea = area / 10000;
    return { totalTreesCount, plantLocationArea };
  }, [plantLocationInfo?.geometry, plantLocationInfo?.type]);

  const plantingDensity = totalTreesCount / plantLocationArea;

  const formattedHid =
    plantLocationInfo?.hid.slice(0, 3) + '-' + plantLocationInfo?.hid.slice(3);

  const sampleInterventionSpeciesImages = useMemo(() => {
    if (plantLocationInfo?.type === 'multi-tree-registration') {
      return extractImages(plantLocationInfo.sampleInterventions);
    }
  }, [
    plantLocationInfo?.type === 'multi-tree-registration'
      ? plantLocationInfo.sampleInterventions
      : null,
  ]);
  const hasSampleInterventionSpeciesImages =
    sampleInterventionSpeciesImages !== undefined &&
    sampleInterventionSpeciesImages?.length > 0;

  const plantingDetails = [
    {
      label: tProjectDetails('plantingDate'),
      data: formatDate(plantLocationInfo?.plantDate ?? new Date()),
    },
    {
      label: tProjectDetails('plantingDensity'),
      data: tProjectDetails('plantingDensityUnit', {
        formattedCount: localizedAbbreviatedNumber(locale, plantingDensity, 1),
      }),
    },
  ];
  const getPlantedTreePercentage = (treeCount: number) => {
    const result = (treeCount / totalTreesCount) * 100;
    if (Number.isInteger(result)) {
      return result;
    }
    return result.toFixed(1);
  };
  return (
    <section className={styles.plantLocationInfoSection}>
      <div className={styles.treeCountWrapper}>
        <div className={styles.treeCount}>
          {tProjectDetails.rich('totalPlantedSpecies', {
            count: totalTreesCount,
            formattedCount: localizedAbbreviatedNumber(
              locale,
              Number(totalTreesCount),
              1
            ),
            area: plantLocationArea.toFixed(3),
            areaContainer: (chunks) => <span>{chunks}</span>,
          })}
        </div>
        <div className={styles.hid}>{formattedHid}</div>
      </div>
      {hasSampleInterventionSpeciesImages && (
        <ImagesSlider
          images={sampleInterventionSpeciesImages}
          type={'coordinate'}
          imageSize={'large'}
          imageHeight={195}
        />
      )}
      <div className={styles.plantingDetailsContainer}>
        {plantingDetails.map((item, key) => {
          return (
            <div key={key} className={styles.plantingDetailsSubContainer}>
              <p className={styles.label}>{item.label}</p>
              <p className={styles.data}>{item.data}</p>
            </div>
          );
        })}
      </div>
      <div className={styles.speciesContainer}>
        <p>
          {tProjectDetails('speciesCount', {
            count:
              plantLocationInfo?.type === 'multi-tree-registration' &&
              plantLocationInfo?.plantedSpecies.length,
          })}
        </p>
        {plantLocationInfo?.type === 'multi-tree-registration' && (
          <div className={styles.speciesSubContainer}>
            {plantLocationInfo.plantedSpecies.map((species) => {
              return (
                <div className={styles.speciesList} key={species.id}>
                  <p className={styles.speciesName}>{species.scientificName}</p>
                  <div className={styles.treeMatrics}>
                    <p>{species.treeCount}</p>
                    <p>{`${getPlantedTreePercentage(species.treeCount)}%`}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className={styles.sampleTreesContainer}>
        <p className={styles.mainLable}>
          {tProjectDetails('sampleTrees', {
            count:
              plantLocationInfo?.type === 'multi-tree-registration' &&
              plantLocationInfo?.sampleInterventions.length,
          })}
        </p>
        <div className={styles.sampleSpeciesListContainer}>
          {plantLocationInfo?.type === 'multi-tree-registration' &&
            plantLocationInfo?.sampleInterventions.map(
              (sampleSpecies, index) => {
                return (
                  <div
                    key={sampleSpecies.id}
                    className={styles.sampleSpeciesContainer}
                  >
                    <div className={styles.scientificNameContainer}>
                      <span>{index + 1}</span>.
                      <p className={styles.scientificName}>
                        {sampleSpecies.scientificName}
                      </p>
                    </div>
                    <p className={styles.speciesMeasurements}>
                      {tProjectDetails('speciesMeasurment', {
                        hid: sampleSpecies.hid,
                        height: sampleSpecies.measurements.height,
                        width: sampleSpecies.measurements.width,
                      })}
                    </p>
                  </div>
                );
              }
            )}
        </div>
      </div>
      <div className={styles.treeMapperLabelContainer}>
        <div className={styles.treeMapperLabelSubContainer}>
          <p>{tProjectDetails('poweredBy')}</p>
          <div>
            <TreeMapperIcon />
          </div>
          <p className={styles.treeMapperLabel}>
            {tProjectDetails('treeMapper')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlantLocationInfoSection;
