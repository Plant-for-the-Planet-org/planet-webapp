import type {
  OtherInterventions,
  SampleIntervention,
} from '../../../common/types/intervention';
import type { SetState } from '../../../common/types/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../styles/PlantLocationInfo.module.scss';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleTrees from './microComponents/SampleTrees';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import ImageSlider from './ImageSlider';
import MobileInfoSwiper from '../../MobileInfoSwiper';
import OtherInterventionMetadata from './microComponents/OtherInterventionMetadata';
import OtherInterventionHeader from './microComponents/OtherInterventionHeader';

interface MetaDataValue {
  value: string;
  label: string;
}

interface PublicMetaData {
  [key: string]: string | MetaDataValue;
}

function isJsonString(str: string) {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch (e) {
    return false;
  }
}

const createCardData = (interventionInfo: OtherInterventions | null) => {
  // Initialize an array to store the cleaned key-value pairs
  const cleanedData: { key: string; value: string }[] = [];

  // Extract metadata from the interventionInfo object, if it exists
  const parsedData = interventionInfo?.metadata;

  // Check if `parsedData.public` exists, is an object, and is not an array
  if (
    parsedData?.public &&
    typeof parsedData.public === 'object' &&
    !Array.isArray(parsedData.public)
  ) {
    // Iterate over the entries of `parsedData.public` as key-value pairs
    Object.entries(parsedData.public as PublicMetaData).forEach(
      ([key, value]) => {
        // Skip the entry if the key is 'isEntireSite' as it's used to show point location and no use to user
        if (key !== 'isEntireSite') {
          // If the value is a string, directly add it to cleanedData
          if (typeof value === 'string') {
            cleanedData.push({ value, key });
          }
          // If the value is an object with `value` and `label` properties
          else if (
            typeof value === 'object' &&
            value !== null &&
            'value' in value &&
            'label' in value
          ) {
            // Check if the `value` property contains a valid JSON string
            if (isJsonString(value.value)) {
              try {
                // Parse the JSON string
                const parsedValue = JSON.parse(value.value);
                // If the parsed value is an object with a `value` property, add it to cleanedData
                if (
                  parsedValue &&
                  typeof parsedValue === 'object' &&
                  'value' in parsedValue
                ) {
                  cleanedData.push({
                    key: value.label, // Use the `label` property as the key
                    value: parsedValue.value, // Use the parsed `value` property
                  });
                }
              } catch (error) {
                // Log an error if JSON parsing fails
                console.error('Error parsing JSON:', error);
              }
            } else {
              // If not a JSON string, add the `label` and `value` directly
              cleanedData.push({
                key: value.label,
                value: value.value,
              });
            }
          }
        }
      }
    );
  }

  // Return the array of cleaned key-value pairs
  return cleanedData;
};

interface Props {
  hoveredIntervention?: OtherInterventions | null;
  selectedIntervention: OtherInterventions | null;
  isMobile: boolean;
  setSelectedSampleIntervention: SetState<SampleIntervention | null>;
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
      <OtherInterventionHeader
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
    <section className={styles.plantLocationInfoSection}>
      {content}
      <TreeMapperBrand />
    </section>
  );
};

export default OtherInterventionInfo;
