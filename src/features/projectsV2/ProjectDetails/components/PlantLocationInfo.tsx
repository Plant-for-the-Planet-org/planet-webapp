import { useMemo } from 'react';
import * as turf from '@turf/turf';
import {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import styles from '../styles/PlantLocationInfo.module.scss';
import ImageCarousel from './ImageCarousel';
import TreePlantedData from './microComponents/TreeCountData';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleSpecies from './microComponents/SampleSpecies';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import PlantingDetails from './microComponents/PlantingDetails';
import { useTranslations } from 'next-intl';

const PlantLocationInfo = ({
  plantLocationInfo,
}: {
  plantLocationInfo: PlantLocation | SamplePlantLocation | null;
}) => {
  const t = useTranslations('ProjectDetails');
  const isMultiTreeRegistration =
    plantLocationInfo?.type === 'multi-tree-registration';
  const tProjectDetails = useTranslations('ProjectDetails');
  const { totalTreesCount, plantedLocationArea } = useMemo(() => {
    const totalTreesCount = isMultiTreeRegistration
      ? plantLocationInfo.plantedSpecies.reduce(
          (sum, species) => sum + species.treeCount,
          0
        )
      : 0;
    const area = plantLocationInfo?.geometry
      ? turf.area(plantLocationInfo?.geometry)
      : 0;
    const plantedLocationArea = area / 10000;
    return { totalTreesCount, plantedLocationArea };
  }, [plantLocationInfo?.geometry, plantLocationInfo?.type]);

  const plantingDensity = totalTreesCount / plantedLocationArea;

  const sampleInterventionSpeciesImages = useMemo(() => {
    if (isMultiTreeRegistration) {
      const result = plantLocationInfo.sampleInterventions.map((item) => {
        return {
          image: item.coordinates[0].image,
          description: tProjectDetails('sampleTreeTag', { tag: item.tag }),
        };
      });
      return result;
    }
  }, [isMultiTreeRegistration ? plantLocationInfo.sampleInterventions : null]);

  const shouldDisplayImageCarousel =
    sampleInterventionSpeciesImages &&
    sampleInterventionSpeciesImages?.length > 0;

  return (
    <section className={styles.plantLocationInfoSection}>
      <TreePlantedData
        plHid={plantLocationInfo?.hid}
        totalTreesCount={totalTreesCount}
        plantedLocationArea={plantedLocationArea}
      />
      {shouldDisplayImageCarousel && (
        <ImageCarousel
          images={sampleInterventionSpeciesImages}
          type={'coordinate'}
          imageSize={'large'}
          imageHeight={195}
          leftAlignment={15}
        />
      )}
      <PlantingDetails
        plantingDensity={plantingDensity}
        plantDate={plantLocationInfo?.plantDate}
      />
      {isMultiTreeRegistration && (
        <SpeciesPlanted
          totalTreesCount={totalTreesCount}
          plantedSpecies={plantLocationInfo.plantedSpecies}
        />
      )}
      {isMultiTreeRegistration && (
        <SampleSpecies
          sampleInterventions={plantLocationInfo.sampleInterventions}
        />
      )}
      <TreeMapperBrand />
    </section>
  );
};

export default PlantLocationInfo;
