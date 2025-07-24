import type { SetState } from '../../../common/types/common';
import type {
  InterventionSingle,
  SampleIntervention,
} from '../../../common/types/intervention';

import PlantInfoCard from './microComponents/PlantInfoCard';
import styles from '../styles/PlantLocationInfo.module.scss';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import SinglePlantLocationHeader from './microComponents/SinglePlantLocationHeader';
import MobileInfoSwiper from '../../MobileInfoSwiper';

interface Props {
  plantData: InterventionSingle | SampleIntervention | undefined;
  isMobile: boolean;
  setSelectedSamplePlantLocation: SetState<SampleIntervention | null>;
}

const SinglePlantLocationInfo = ({
  plantData,
  isMobile,
  setSelectedSamplePlantLocation,
}: Props) => {
  if (!plantData) return null;

  const plantInfoProps = {
    interventionStartDate: plantData.interventionStartDate,
    tag: plantData.tag,
    scientificName: plantData.scientificName,
    measurements: plantData.measurements,
    type: plantData.type,
    setSelectedSamplePlantLocation,
  };

  const content = [
    <SinglePlantLocationHeader
      key="singlePlantLocationHeader"
      plantData={plantData}
    />,
    <PlantInfoCard key="plantInfoCard" {...plantInfoProps} />,
  ].filter(Boolean);

  return isMobile ? (
    <MobileInfoSwiper slides={content} uniqueKey={plantData.hid} />
  ) : (
    <div className={styles.plantLocationInfoSection}>
      <SinglePlantLocationHeader plantData={plantData} />
      <PlantInfoCard {...plantInfoProps} />
      <TreeMapperBrand />
    </div>
  );
};

export default SinglePlantLocationInfo;
