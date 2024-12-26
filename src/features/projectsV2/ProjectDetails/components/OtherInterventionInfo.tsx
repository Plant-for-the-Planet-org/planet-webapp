import type {
  Measurements,
  PlantedSpecies,
  PlantLocationBase,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import type { DateString, SetState } from '../../../common/types/common';

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
import { INTERVENTION_TYPE } from '../../../../utils/constants/intervention';

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
  plantLocationInfo: any | null;
  isMobile: boolean;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
}

const OtherInterventionInfo = ({
  plantLocationInfo,
  isMobile,
  setSelectedSamplePlantLocation,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const isMultiTreeRegistration =
    plantLocationInfo?.type === 'enrichment-planting';
  const { totalTreesCount, plantedLocationArea } = useMemo(() => {
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

  const plantingDensity = totalTreesCount / plantedLocationArea;

  const sampleInterventionSpeciesImages = useMemo(() => {
    if (isMultiTreeRegistration) {
      const result = plantLocationInfo.sampleInterventions && plantLocationInfo.sampleInterventions.map((item: {
        coordinates: {
          id: any; image: any;
        }[]; tag: any;
      }) => {
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
      plantingDensity={plantingDensity}
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
    isMultiTreeRegistration &&
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
