import type {
  PlantedSpecies,
  PlantLocationBase,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import type { SetState } from '../../../common/types/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../styles/PlantLocationInfo.module.scss';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleTrees from './microComponents/SampleTrees';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import ImageSlider from './microComponents/ImageSlider';
import MobileInfoSwiper from '../../MobileInfoSwiper';
import OtherInterventionInfoHeader from './microComponents/OtherInterventionHeader';
import OtherInterventionMetaData from './microComponents/OtherInterventionMetaData';
import InterventionHeader from './microComponents/InterventionHeader';

interface MetaDataValue {
  value: string;
  label: string;
}


interface PublicMetaData {
  [key: string]: string | MetaDataValue;
}


export interface OtherInterventions extends PlantLocationBase {
  sampleTreeCount: number;
  sampleInterventions: SamplePlantLocation[];
  plantedSpecies: PlantedSpecies[];
  type: string
}

interface Props {
  plantLocationInfo: OtherInterventions;
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
          (sum, species: { treeCount: number }) => sum + species.treeCount,
          0
        )
        : 0;
    return { totalTreesCount };
  }, [plantLocationInfo, plantLocationInfo?.type]);

  const sampleInterventionSpeciesImages = useMemo(() => {
    if (plantLocationInfo && plantLocationInfo.sampleInterventions.length > 0) {
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



  function isJsonString(str: string) {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
      return false;
    }
  }


  const createCardData = () => {
    const checkForPublic: { key: string; value: string }[] = [];
    const parsedData = plantLocationInfo?.metadata;

    if (parsedData?.public && typeof parsedData.public === 'object' && !Array.isArray(parsedData.public)) {
      Object.entries(parsedData.public as PublicMetaData).forEach(([key, value]) => {
        if (key !== 'isEntireSite') {
          if (typeof value === 'string') {
            checkForPublic.push({ value, key });
          } else if (typeof value === 'object' && value !== null && 'value' in value && 'label' in value) {
            if (isJsonString(value.value)) {
              try {
                const parsedValue = JSON.parse(value.value);
                if (parsedValue && typeof parsedValue === 'object' && 'value' in parsedValue) {
                  checkForPublic.push({ value: parsedValue.value, key: value.label });
                }
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
            } else {
              checkForPublic.push({ value: value.value, key: value.label });
            }
          }
        }
      });
    }

    return checkForPublic;
  };

  const cleanedPublicMetadata = createCardData()



  const content = [
    <>
      <InterventionHeader plHid={plantLocationInfo?.hid} interventionType={plantLocationInfo?.type} key="interventionHeader" />
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
    <OtherInterventionInfoHeader
      key="interventionHeader"
      plantDate={plantLocationInfo?.interventionStartDate}
    />,
    cleanedPublicMetadata.length > 0 && <OtherInterventionMetaData
      key="plantingDetails"
      metaData={cleanedPublicMetadata}
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
