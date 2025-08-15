import type {
  OtherInterventions,
  SampleTreeRegistration,
} from '../../../common/types/intervention';
import type { SetState } from '../../../common/types/common';

import { useMemo, Fragment } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../styles/InterventionInfo.module.scss';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleTreesInfo from './microComponents/SampleTreesInfo';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import ImageSlider from './ImageSlider';
import MobileInfoSwiper from '../../MobileInfoSwiper';
import OtherInterventionMetadata from './microComponents/OtherInterventionMetadata';
import OtherInterventionInfoHeader from './microComponents/OtherInterventionInfoHeader';
import { prepareInterventionMetadata } from '../../../../utils/projectV2';

interface Props {
  hoveredIntervention?: OtherInterventions | null;
  selectedIntervention: OtherInterventions | null;
  isMobile: boolean;
  setSelectedSampleTree: SetState<SampleTreeRegistration | null>;
}

const OtherInterventionInfo = ({
  isMobile,
  setSelectedSampleTree,
  selectedIntervention,
  hoveredIntervention,
}: Props) => {
  const interventionInfo = hoveredIntervention || selectedIntervention;
  if (!interventionInfo) return null;
  const tProjectDetails = useTranslations('ProjectDetails');
  const interventionMetadata = prepareInterventionMetadata(interventionInfo);

  const sampleTrees = interventionInfo.sampleInterventions || [];
  const plantedSpecies = interventionInfo.plantedSpecies || [];
  const hasSampleTrees = sampleTrees.length > 0;
  const hasPlantedSpecies = plantedSpecies.length > 0;
  const hasInterventionMetadata = interventionMetadata.length > 0;

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
    if (hasSampleTrees) {
      const result = sampleTrees.map((item) => {
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

  const content = [
    <Fragment key="interventionHeaderAndImage">
      <OtherInterventionInfoHeader
        hid={interventionInfo.hid}
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
    </Fragment>,
    hasInterventionMetadata && (
      <OtherInterventionMetadata
        key="plantingDetails"
        metadata={interventionMetadata}
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
    hasSampleTrees && (
      <SampleTreesInfo
        key="sampleTrees"
        sampleTrees={sampleTrees}
        setSelectedSampleTree={setSelectedSampleTree}
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
