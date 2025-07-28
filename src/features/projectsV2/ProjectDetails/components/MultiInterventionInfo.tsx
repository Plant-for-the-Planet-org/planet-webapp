import type {
  InterventionMulti,
  SampleIntervention,
} from '../../../common/types/intervention';
import type { SetState } from '../../../common/types/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import * as turf from '@turf/turf';
import styles from '../styles/InterventionInfo.module.scss';
import InterventionHeader from './microComponents/InterventionHeader';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleTrees from './microComponents/SampleTrees';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import PlantingDetails from './microComponents/PlantingDetails';
import ImageSlider from './ImageSlider';
import MobileInfoSwiper from '../../MobileInfoSwiper';

interface Props {
  interventionInfo: InterventionMulti;
  isMobile: boolean;
  setSelectedSampleIntervention: SetState<SampleIntervention | null>;
}

const MultiInterventionInfo = ({
  interventionInfo,
  isMobile,
  setSelectedSampleIntervention,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');

  const { totalTreesCount, interventionAreaHectares } = useMemo(() => {
    const totalTreesCount = interventionInfo.plantedSpecies.reduce(
      (sum, species) => sum + species.treeCount,
      0
    );
    const area = turf.area(interventionInfo.geometry);
    const interventionAreaHectares = area / 10000;
    return { totalTreesCount, interventionAreaHectares };
  }, [interventionInfo.geometry, interventionInfo.type]);

  const plantingDensity = totalTreesCount / interventionAreaHectares;

  const sampleInterventionSpeciesImages = useMemo(() => {
    const result = interventionInfo.sampleInterventions.map((item) => {
      return {
        id: item.coordinates[0].id,
        image: item.coordinates[0].image ?? '',
        description: tProjectDetails('sampleTreeTag', { tag: item.tag }),
      };
    });
    return result;
  }, [interventionInfo.sampleInterventions]);

  const shouldDisplayImageCarousel =
    sampleInterventionSpeciesImages !== undefined &&
    sampleInterventionSpeciesImages.length > 0;

  const content = [
    <>
      <InterventionHeader
        key="interventionHeader"
        plHid={interventionInfo.hid}
        totalTreesCount={totalTreesCount}
        interventionAreaHectares={interventionAreaHectares}
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
      plantDate={interventionInfo.interventionStartDate}
    />,
    interventionInfo.plantedSpecies.length > 0 && (
      <SpeciesPlanted
        key="speciesPlanted"
        totalTreesCount={totalTreesCount}
        plantedSpecies={interventionInfo.plantedSpecies}
      />
    ),
    interventionInfo.sampleInterventions.length > 0 && (
      <SampleTrees
        key="sampleTrees"
        sampleInterventions={interventionInfo.sampleInterventions}
        setSelectedSampleIntervention={setSelectedSampleIntervention}
      />
    ),
  ].filter(Boolean);

  return isMobile ? (
    <MobileInfoSwiper slides={content} uniqueKey={interventionInfo.hid || ''} />
  ) : (
    <section className={styles.plantLocationInfoSection}>
      {content}
      <TreeMapperBrand />
    </section>
  );
};

export default MultiInterventionInfo;
