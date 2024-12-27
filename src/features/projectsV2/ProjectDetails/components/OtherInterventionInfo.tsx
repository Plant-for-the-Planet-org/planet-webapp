import type {
  Measurements,
  PlantedSpecies,
  PlantLocationBase,
  PlantLocationMulti,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import type { SetState } from '../../../common/types/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import * as turf from '@turf/turf';
import styles from '../styles/PlantLocationInfo.module.scss';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleTrees from './microComponents/SampleTrees';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import ImageSlider from './microComponents/ImageSlider';
import MobileInfoSwiper from '../../MobileInfoSwiper';
import OtherInterventionInfoHeader from './microComponents/OtherInterventionHeader';
import OtherInterventionMetaData from './microComponents/OtherInterventionMetaData';

export interface OtherInterventions extends PlantLocationBase {
  sampleTreeCount: number;
  sampleInterventions: SamplePlantLocation[];
  plantedSpecies: PlantedSpecies[];
  nextMeasurementDate: null;
  scientificName: string | null;
  scientificSpecies: string | null;
  tag: string | null;
  measurements: Measurements;
  originalGeometry: turf.Point;
  geometry: turf.Point;
}

interface Props {
  plantLocationInfo: PlantLocationMulti | null;
  isMobile: boolean;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
}

const OtherInterventionInfo = ({
  plantLocationInfo,
  isMobile,
  setSelectedSamplePlantLocation,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');


  const { totalTreesCount } = useMemo(() => {
    const totalTreesCount =
      plantLocationInfo &&
        plantLocationInfo.plantedSpecies &&
        plantLocationInfo.plantedSpecies.length > 0
        ? plantLocationInfo.plantedSpecies.reduce(
          (sum: any, species: { treeCount: any; }) => sum + species.treeCount,
          0
        )
        : 0;
    const area = plantLocationInfo?.geometry
      ? turf.area(plantLocationInfo?.geometry)
      : 0;
    const plantedLocationArea = area / 10000;
    return { totalTreesCount, plantedLocationArea };
  }, [plantLocationInfo?.geometry, plantLocationInfo?.type]);

  const sampleInterventionSpeciesImages = useMemo(() => {
    if (plantLocationInfo && plantLocationInfo.sampleInterventions.length>0) {
      const result = plantLocationInfo.sampleInterventions && plantLocationInfo.sampleInterventions.map((item) => {
        return {
          id: item.coordinates[0].id,
          image: item.coordinates[0].image ?? '',
          description: tProjectDetails('sampleTreeTag', { tag: item.tag }),
        };
      });
      return result;
    }
  }, [plantLocationInfo]);

  const shouldDisplayImageCarousel =
    sampleInterventionSpeciesImages !== undefined &&
    sampleInterventionSpeciesImages?.length > 0;

  const checkForPublicData = plantLocationInfo?.metadata.public.length !== 0

  const content = [
    shouldDisplayImageCarousel && (
      <ImageSlider
        key="imageSlider"
        images={sampleInterventionSpeciesImages}
        type="coordinate"
        isMobile={isMobile}
        imageSize="large"
        allowFullView={!isMobile}
      />
    )
    ,
    <OtherInterventionInfoHeader
      key="plantingDetails"
      plantDate={plantLocationInfo?.interventionStartDate}
      type={plantLocationInfo?.type}
    />,
    checkForPublicData && <OtherInterventionMetaData
      key="plantingDetails"
      metaData={plantLocationInfo?.metadata}
      plantDate={plantLocationInfo?.interventionStartDate}
      type={plantLocationInfo?.type}
    />,
    plantLocationInfo?.plantedSpecies && plantLocationInfo.plantedSpecies.length > 0 && (
      <SpeciesPlanted
        key="speciesPlanted"
        totalTreesCount={totalTreesCount}
        plantedSpecies={plantLocationInfo.plantedSpecies}
      />
    ),
    plantLocationInfo &&
    plantLocationInfo.sampleInterventions && plantLocationInfo.sampleInterventions.length > 0 && (
      <SampleTrees
        key="sampleTrees"
        sampleInterventions={plantLocationInfo.sampleInterventions}
        setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
      />
    ),
  ].filter(Boolean);

  return isMobile ? (
    <>
      <MobileInfoSwiper
        slides={content}
        uniqueKey={plantLocationInfo?.hid || ''}
      />
    </>
  ) : (
    <section className={styles.plantLocationInfoSection}>
      {content}
      <TreeMapperBrand />
    </section>
  );
};

export default OtherInterventionInfo;
