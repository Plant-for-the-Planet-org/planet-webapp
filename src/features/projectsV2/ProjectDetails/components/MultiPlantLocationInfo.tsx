import type {
  PlantLocationMulti,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import type { SetState } from '../../../common/types/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import * as turf from '@turf/turf';
import styles from '../styles/PlantLocationInfo.module.scss';
import PlantLocationHeader from './microComponents/PlantLocationHeader';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleTrees from './microComponents/SampleTrees';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import PlantingDetails from './microComponents/PlantingDetails';
import ImageSlider from './ImageSlider';
import MobileInfoSwiper from '../../MobileInfoSwiper';

interface Props {
  plantLocationInfo: PlantLocationMulti;
  isMobile: boolean;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
}

const MultiPlantLocationInfo = ({
  plantLocationInfo,
  isMobile,
  setSelectedSamplePlantLocation,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');

  const { totalTreesCount, plantLocationAreaHectares } = useMemo(() => {
    const totalTreesCount = plantLocationInfo.plantedSpecies.reduce(
      (sum, species) => sum + species.treeCount,
      0
    );
    const area = turf.area(plantLocationInfo.geometry);
    const plantLocationAreaHectares = area / 10000;
    return { totalTreesCount, plantLocationAreaHectares };
  }, [plantLocationInfo.geometry, plantLocationInfo.type]);

  const plantingDensity = totalTreesCount / plantLocationAreaHectares;

  const sampleInterventionSpeciesImages = useMemo(() => {
    const result = plantLocationInfo.sampleInterventions.map((item) => {
      return {
        id: item.coordinates[0].id,
        image: item.coordinates[0].image ?? '',
        description: tProjectDetails('sampleTreeTag', { tag: item.tag }),
      };
    });
    return result;
  }, [plantLocationInfo.sampleInterventions]);

  const shouldDisplayImageCarousel =
    sampleInterventionSpeciesImages !== undefined &&
    sampleInterventionSpeciesImages.length > 0;

  const content = [
    <>
      <PlantLocationHeader
        key="plantLocationHeader"
        plHid={plantLocationInfo.hid}
        totalTreesCount={totalTreesCount}
        plantLocationAreaHectares={plantLocationAreaHectares}
      />
      {shouldDisplayImageCarousel && (
        <ImageSlider
          key="imageSlider"
          images={sampleInterventionSpeciesImages}
          type="coordinate"
          isMobile={isMobile}
          imageSize="large"
          allowFullView={!isMobile}
        />
      )}
    </>,
    <PlantingDetails
      key="plantingDetails"
      plantingDensity={plantingDensity}
      plantDate={plantLocationInfo.interventionStartDate}
    />,
    plantLocationInfo.plantedSpecies.length > 0 && (
      <SpeciesPlanted
        key="speciesPlanted"
        totalTreesCount={totalTreesCount}
        plantedSpecies={plantLocationInfo.plantedSpecies}
      />
    ),
    plantLocationInfo.sampleInterventions.length > 0 && (
      <SampleTrees
        key="sampleTrees"
        sampleInterventions={plantLocationInfo.sampleInterventions}
        setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
      />
    ),
  ].filter(Boolean);

  return isMobile ? (
    <MobileInfoSwiper
      slides={content}
      uniqueKey={plantLocationInfo.hid || ''}
    />
  ) : (
    <section className={styles.plantLocationInfoSection}>
      {content}
      <TreeMapperBrand />
    </section>
  );
};

export default MultiPlantLocationInfo;
