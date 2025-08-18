import type {
  MultiTreeRegistration,
  SampleTreeRegistration,
} from '../../../common/types/intervention';
import type { SetState } from '../../../common/types/common';

import { Fragment, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import area from '@turf/area';
import styles from '../styles/InterventionInfo.module.scss';
import MultiTreeInfoHeader from './microComponents/MultiTreeInfoHeader';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleTreesInfo from './microComponents/SampleTreesInfo';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import PlantingDetails from './microComponents/PlantingDetails';
import ImageSlider from './ImageSlider';
import MobileInfoSwiper from '../../MobileInfoSwiper';

interface Props {
  activeMultiTree: MultiTreeRegistration;
  isMobile: boolean;
  setSelectedSampleTree: SetState<SampleTreeRegistration | null>;
}

const MultiTreeInfo = ({
  activeMultiTree,
  isMobile,
  setSelectedSampleTree,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');

  const { totalTreesCount, hectaresCovered } = useMemo(() => {
    const totalTreesCount = activeMultiTree.plantedSpecies.reduce(
      (sum, species) => sum + species.treeCount,
      0
    );
    const calculatedArea = area(activeMultiTree.geometry);
    const hectaresCovered = calculatedArea / 10000;
    return { totalTreesCount, hectaresCovered };
  }, [
    activeMultiTree.geometry,
    activeMultiTree.type,
    activeMultiTree.plantedSpecies,
  ]);

  const plantingDensity =
    hectaresCovered > 0 ? totalTreesCount / hectaresCovered : 0;

  const sampleInterventionSpeciesImages = useMemo(() => {
    const result = activeMultiTree.sampleInterventions.map((item) => {
      return {
        id: item.coordinates[0].id,
        image: item.coordinates[0].image ?? '',
        description: tProjectDetails('sampleTreeTag', { tag: item.tag }),
      };
    });
    return result;
  }, [activeMultiTree.sampleInterventions]);

  const shouldDisplayImageCarousel =
    sampleInterventionSpeciesImages !== undefined &&
    sampleInterventionSpeciesImages.length > 0;

  const content = [
    <Fragment key="headerAndImage">
      <MultiTreeInfoHeader
        key="multiTreeInfoHeader"
        hid={activeMultiTree.hid}
        totalTreesCount={totalTreesCount}
        hectaresCovered={hectaresCovered}
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
    <PlantingDetails
      key="plantingDetails"
      plantingDensity={plantingDensity}
      plantDate={
        activeMultiTree.interventionStartDate || activeMultiTree.plantDate
      }
    />,
    activeMultiTree.plantedSpecies.length > 0 && (
      <SpeciesPlanted
        key="speciesPlanted"
        totalTreesCount={totalTreesCount}
        plantedSpecies={activeMultiTree.plantedSpecies}
        plantProject={activeMultiTree.plantProject}
      />
    ),
    activeMultiTree.sampleInterventions.length > 0 && (
      <SampleTreesInfo
        key="sampleTrees"
        sampleTrees={activeMultiTree.sampleInterventions}
        setSelectedSampleTree={setSelectedSampleTree}
      />
    ),
  ].filter(Boolean);

  return isMobile ? (
    <MobileInfoSwiper slides={content} uniqueKey={activeMultiTree.hid || ''} />
  ) : (
    <section className={styles.interventionInfoSection}>
      {content}
      <TreeMapperBrand />
    </section>
  );
};

export default MultiTreeInfo;
