import type {
  OtherInterventions,
  SampleTreeRegistration,
} from '../../../common/types/intervention';
import type { SetState } from '../../../common/types/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../styles/InterventionInfo.module.scss';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleTrees from './microComponents/SampleTrees';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import ImageSlider from './ImageSlider';
import MobileInfoSwiper from '../../MobileInfoSwiper';
import OtherInterventionMetadata from './microComponents/OtherInterventionMetadata';
import OtherInterventionInfoHeader from './microComponents/OtherInterventionInfoHeader';
import { createCardData } from '../../../../utils/projectV2';

interface Props {
  hoveredIntervention?: OtherInterventions | null;
  selectedIntervention: OtherInterventions | null;
  isMobile: boolean;
  setSelectedSampleIntervention: SetState<SampleTreeRegistration | null>;
}

const OtherInterventionInfo = ({
  isMobile,
  setSelectedSampleIntervention,
  selectedIntervention,
  hoveredIntervention,
}: Props) => {
  const interventionInfo = hoveredIntervention || selectedIntervention;
  if (!interventionInfo) return null;
  const sampleInterventions = interventionInfo.sampleInterventions || [];
  const plantedSpecies = interventionInfo.plantedSpecies || [];
  const hasSampleInterventions = sampleInterventions.length > 0;
  const hasPlantedSpecies = plantedSpecies.length > 0;

  const tProjectDetails = useTranslations('ProjectDetails');
  const { totalTreesCount } = useMemo(() => {
    const totalTreesCount = hasPlantedSpecies
      ? plantedSpecies.reduce(
          (sum, species: { treeCount: number }) => sum + species.treeCount,
          0
        )
      : 0;
    return { totalTreesCount };
  }, [interventionInfo, interventionInfo.type]);

  const sampleInterventionSpeciesImages = useMemo(() => {
    if (hasSampleInterventions) {
      const result = sampleInterventions.map((item) => {
        return {
          id: item.coordinates[0].id,
          image: item.coordinates[0].image ?? '',
          description: tProjectDetails('sampleTreeTag', { tag: item.tag }),
        };
      });
      return result;
    }
  }, [interventionInfo]);

  const shouldDisplayImageCarousel =
    sampleInterventionSpeciesImages !== undefined &&
    sampleInterventionSpeciesImages?.length > 0;

  const cleanedPublicMetadata = createCardData(interventionInfo);

  const content = [
    <>
      <OtherInterventionInfoHeader
        plHid={interventionInfo.hid}
        interventionType={interventionInfo.type}
        plantDate={interventionInfo.interventionStartDate}
        key="interventionHeader"
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
    cleanedPublicMetadata.length > 0 && (
      <OtherInterventionMetadata
        key="plantingDetails"
        metadata={cleanedPublicMetadata}
        plantDate={interventionInfo.interventionStartDate}
        type={interventionInfo.type}
      />
    ),
    hasPlantedSpecies && (
      <SpeciesPlanted
        key="speciesPlanted"
        totalTreesCount={totalTreesCount}
        plantedSpecies={plantedSpecies}
      />
    ),
    hasSampleInterventions && (
      <SampleTrees
        key="sampleTrees"
        sampleInterventions={sampleInterventions}
        setSelectedSampleIntervention={setSelectedSampleIntervention}
      />
    ),
  ].filter(Boolean);

  return isMobile ? (
    <>
      <MobileInfoSwiper
        slides={content}
        uniqueKey={interventionInfo.hid || ''}
      />
    </>
  ) : (
    <section className={styles.interventionInfoSection}>
      {content}
      <TreeMapperBrand />
    </section>
  );
};

export default OtherInterventionInfo;
