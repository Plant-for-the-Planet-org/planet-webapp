import { useMemo } from 'react';
import * as turf from '@turf/turf';
import {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import styles from '../styles/PlantLocationInfo.module.scss';
import { extractImages } from '../utils';
import ImagesSlider from './ImagesSlider';
import TreePlantedData from './microComponents/TreeCountData';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleSpecies from './microComponents/SampleSpecies';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import PlantingDetails from './microComponents/PlantingDetails';
import SampleTreeInfoCard from './microComponents/SampleTreeInfoCard';
import { formatHid } from '../utils';
import { useTranslations } from 'next-intl';

const PlantLocationInfo = ({
  plantLocationInfo,
}: {
  plantLocationInfo: PlantLocation | SamplePlantLocation | null;
}) => {
  const t = useTranslations('ProjectDetails');
  const isMultiTreeRegistration =
    plantLocationInfo?.type === 'multi-tree-registration';

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
      return extractImages(plantLocationInfo.sampleInterventions);
    }
  }, [isMultiTreeRegistration ? plantLocationInfo.sampleInterventions : null]);

  const isSampleTree = plantLocationInfo?.type === 'sample-tree-registration';
  return (
    <section className={styles.plantLocationInfoSection}>
      {isSampleTree ? (
        <div className={styles.sampleTreeInfoHeading}>
          <h1>{t('sampleTree')}</h1>
          <p>{formatHid(plantLocationInfo?.hid)}</p>
        </div>
      ) : (
        <TreePlantedData
          plHid={plantLocationInfo?.hid}
          totalTreesCount={totalTreesCount}
          plantedLocationArea={plantedLocationArea}
        />
      )}
      {(sampleInterventionSpeciesImages || plantLocationInfo?.coordinates) && (
        <ImagesSlider
          images={
            isSampleTree
              ? plantLocationInfo.coordinates
              : sampleInterventionSpeciesImages
          }
          type={'coordinate'}
          imageSize={'large'}
          imageHeight={195}
          hideProgressContainer={isSampleTree ? true : false}
        />
      )}

      {isSampleTree ? (
        <SampleTreeInfoCard
          plantDate={plantLocationInfo?.plantDate}
          treeTagNumber={plantLocationInfo?.tag}
          scientificName={plantLocationInfo?.scientificName}
          measurment={plantLocationInfo?.measurements}
        />
      ) : (
        <>
          {' '}
          <PlantingDetails
            plantingDensity={plantingDensity}
            plantDate={plantLocationInfo?.plantDate}
          />
          {isMultiTreeRegistration && (
            <SpeciesPlanted
              totalTreesCount={totalTreesCount}
              plantedSpecies={plantLocationInfo.plantedSpecies}
            />
          )}
          {isMultiTreeRegistration && (
            <SampleSpecies
              sampleInterventions={plantLocationInfo.sampleInterventions}
            />
          )}
        </>
      )}

      <TreeMapperBrand />
    </section>
  );
};

export default PlantLocationInfo;
