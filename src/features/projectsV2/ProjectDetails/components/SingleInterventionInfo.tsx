import type { SetState } from '../../../common/types/common';
import type {
  InterventionSingle,
  SampleIntervention,
} from '../../../common/types/intervention';

import PlantInfoCard from './microComponents/PlantInfoCard';
import styles from '../styles/PlantLocationInfo.module.scss';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import SingleInterventionHeader from './microComponents/SingleInterventionHeader';
import MobileInfoSwiper from '../../MobileInfoSwiper';

interface Props {
  plantData: InterventionSingle | SampleIntervention | undefined;
  isMobile: boolean;
  setSelectedSampleIntervention: SetState<SampleIntervention | null>;
}

const SingleInterventionInfo = ({
  plantData,
  isMobile,
  setSelectedSampleIntervention,
}: Props) => {
  if (!plantData) return null;

  const plantInfoProps = {
    interventionStartDate: plantData.interventionStartDate,
    tag: plantData.tag,
    scientificName: plantData.scientificName,
    measurements: plantData.measurements,
    type: plantData.type,
    setSelectedSampleIntervention,
  };

  const content = [
    <SingleInterventionHeader
      key="singleInterventionHeader"
      plantData={plantData}
    />,
    <PlantInfoCard key="plantInfoCard" {...plantInfoProps} />,
  ].filter(Boolean);

  return isMobile ? (
    <MobileInfoSwiper slides={content} uniqueKey={plantData.hid} />
  ) : (
    <div className={styles.plantLocationInfoSection}>
      <SingleInterventionHeader plantData={plantData} />
      <PlantInfoCard {...plantInfoProps} />
      <TreeMapperBrand />
    </div>
  );
};

export default SingleInterventionInfo;
