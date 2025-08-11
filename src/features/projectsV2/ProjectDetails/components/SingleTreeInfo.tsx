import type { SetState } from '../../../common/types/common';
import type {
  SingleTreeRegistration,
  SampleTreeRegistration,
} from '../../../common/types/intervention';

import PlantInfoCard from './microComponents/PlantInfoCard';
import styles from '../styles/InterventionInfo.module.scss';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import SingleTreeInfoHeader from './microComponents/SingleTreeInfoHeader';
import MobileInfoSwiper from '../../MobileInfoSwiper';

interface Props {
  activeSingleTree: SingleTreeRegistration | SampleTreeRegistration | undefined;
  isMobile: boolean;
  setSelectedSampleIntervention: SetState<SampleTreeRegistration | null>;
}

const SingleTreeInfo = ({
  activeSingleTree,
  isMobile,
  setSelectedSampleIntervention,
}: Props) => {
  if (!activeSingleTree) return null;

  const plantInfoProps = {
    interventionStartDate: activeSingleTree.interventionStartDate,
    tag: activeSingleTree.tag,
    scientificName: activeSingleTree.scientificName,
    measurements: activeSingleTree.measurements,
    type: activeSingleTree.type,
    setSelectedSampleIntervention,
  };

  const content = [
    <SingleTreeInfoHeader
      key="singleTreeInfoHeader"
      activeSingleTree={activeSingleTree}
    />,
    <PlantInfoCard key="plantInfoCard" {...plantInfoProps} />,
  ].filter(Boolean);

  return isMobile ? (
    <MobileInfoSwiper slides={content} uniqueKey={activeSingleTree.hid} />
  ) : (
    <div className={styles.interventionInfoSection}>
      <SingleTreeInfoHeader activeSingleTree={activeSingleTree} />
      <PlantInfoCard {...plantInfoProps} />
      <TreeMapperBrand />
    </div>
  );
};

export default SingleTreeInfo;
