import PlantInfoCard from './microComponents/PlantInfoCard';
import { formatHid } from '../../../../utils/projectV2';
import styles from '../styles/PlantLocationInfo.module.scss';
import { useTranslations } from 'next-intl';
import getImageUrl from '../../../../utils/getImageURL';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import { SetState } from '../../../common/types/common';
import {
  PlantLocationSingle,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';

interface Props {
  plantData: PlantLocationSingle | SamplePlantLocation | undefined;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
}

const SinglePlantLocationInfo = ({
  plantData,
  setSelectedSamplePlantLocation,
}: Props) => {
  const t = useTranslations('ProjectDetails');
  const isSinglePlant =
    plantData?.type === 'single-tree-registration' ||
    plantData?.type === 'sample-tree-registration';
  const isSamplePlant = plantData?.type === 'sample-tree-registration';
  const plantInfoProps = {
    interventionStartDate: plantData?.interventionStartDate,
    tag: isSinglePlant ? plantData.tag : undefined,
    scientificName: isSinglePlant ? plantData.scientificName : undefined,
    measurements: isSinglePlant ? plantData.measurements : undefined,
    type: isSinglePlant ? plantData?.type : undefined,
    setSelectedSamplePlantLocation,
  };
  const image = plantData?.coordinates?.[0]?.image ?? '';
  return (
    <div className={styles.plantLocationInfoSection}>
      <div className={styles.sampleTreeInfoHeading}>
        {isSamplePlant ? <h1>{t('sampleTree')}</h1> : <h1>{t('1Tree')}</h1>}
        <p>{formatHid(plantData?.hid)}</p>
      </div>
      {image && (
        <img
          src={getImageUrl('coordinate', 'large', image)}
          className={styles.samplePlantImage}
        />
      )}
      <PlantInfoCard {...plantInfoProps} />
      <TreeMapperBrand />
    </div>
  );
};

export default SinglePlantLocationInfo;
