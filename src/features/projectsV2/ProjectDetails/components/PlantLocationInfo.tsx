import { useMemo } from 'react';
import * as turf from '@turf/turf';
import {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import styles from '../styles/PlantLocationInfo.module.scss';
import { extractImages } from '../utils';
import ImagesSlider from './ImagesSlider';
import TreePlantedData from './microComponents/TreeCountData';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleSpecies from './microComponents/SampleSpecies';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import PlantingDetails from './microComponents/PlantingDetails';

const PlantLocationInfo = ({
  plantLocationInfo,
}: {
  plantLocationInfo: PlantLocation | SamplePlantLocation | null;
}) => {
  const isMultiTreeRegistration =
    plantLocationInfo?.type === 'multi-tree-registration';

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
      return extractImages(plantLocationInfo.sampleInterventions);
    }
  }, [isMultiTreeRegistration ? plantLocationInfo.sampleInterventions : null]);

  const hasSampleInterventionSpeciesImages =
    sampleInterventionSpeciesImages !== undefined &&
    sampleInterventionSpeciesImages?.length > 0;

  return (
    <section className={styles.plantLocationInfoSection}>
      <TreePlantedData
        plHid={plantLocationInfo?.hid}
        totalTreesCount={totalTreesCount}
        plantedLocationArea={plantedLocationArea}
      />
      {hasSampleInterventionSpeciesImages && (
        <ImagesSlider
          images={sampleInterventionSpeciesImages}
          type={'coordinate'}
          imageSize={'large'}
          imageHeight={195}
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
