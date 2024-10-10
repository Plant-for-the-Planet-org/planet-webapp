import { useMemo } from 'react';
import * as turf from '@turf/turf';
import {
  PlantLocationMulti,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import styles from '../styles/PlantLocationInfo.module.scss';
import PlantLocationHeader from './microComponents/PlantLocationHeader';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleTrees from './microComponents/SampleTrees';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import PlantingDetails from './microComponents/PlantingDetails';
import { useTranslations } from 'next-intl';
import ImageSlider from './microComponents/ImageSlider';
import { SetState } from '../../../common/types/common';

interface Props {
  plantLocationInfo: PlantLocationMulti | null;
  isMobile: boolean;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
}

const MultiPlantLocationInfo = ({
  plantLocationInfo,
  isMobile,
  setSelectedSamplePlantLocation,
}: Props) => {
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
          id: item.coordinates[0].id,
          image: item.coordinates[0].image ?? '',
          description: tProjectDetails('sampleTreeTag', { tag: item.tag }),
        };
      });
      return result;
    }
  }, [isMultiTreeRegistration ? plantLocationInfo.sampleInterventions : null]);

  const shouldDisplayImageCarousel =
    sampleInterventionSpeciesImages !== undefined &&
    sampleInterventionSpeciesImages?.length > 0;
  const hasSampleInterventions =
    plantLocationInfo?.type === 'multi-tree-registration' &&
    plantLocationInfo.sampleInterventions.length > 0;
  return (
    <section className={styles.plantLocationInfoSection}>
      <PlantLocationHeader
        plHid={plantLocationInfo?.hid}
        totalTreesCount={totalTreesCount}
        plantedLocationArea={
          hasSampleInterventions ? plantedLocationArea : null
        }
      />
      {shouldDisplayImageCarousel && (
        <ImageSlider
          images={sampleInterventionSpeciesImages}
          type="coordinate"
          isMobile={isMobile}
          imageSize="large"
        />
      )}
      <PlantingDetails
        plantingDensity={hasSampleInterventions ? plantingDensity : null}
        plantDate={plantLocationInfo?.interventionStartDate}
      />
      {isMultiTreeRegistration &&
        plantLocationInfo.plantedSpecies.length > 0 && (
          <SpeciesPlanted
            totalTreesCount={totalTreesCount}
            plantedSpecies={plantLocationInfo.plantedSpecies}
          />
        )}
      {isMultiTreeRegistration &&
        plantLocationInfo.sampleInterventions.length > 0 && (
          <SampleTrees
            sampleInterventions={plantLocationInfo.sampleInterventions}
            setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
          />
        )}
      <TreeMapperBrand />
    </section>
  );
};

export default MultiPlantLocationInfo;
