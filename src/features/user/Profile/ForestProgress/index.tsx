import type { ProfilePageType } from '../../../common/types/myForest';

import { useState, useEffect } from 'react';
import styles from './ForestProgress.module.scss';
import TargetsModal from './TargetsModal';
import { useMyForestStore } from '../../../../stores/myForestStore';
import EmptyProgress from './EmptyProgress';
import ForestProgressItem from './ForestProgressItem';
import {
  checkProgressEnabled,
  aggregateProgressData,
} from '../../../../utils/myForestUtils';

type ForestProgressProp = {
  profilePageType: ProfilePageType;
};
interface ProgressBarsProps {
  handleEditTargets: () => void;
  treeTarget: number;
  restorationTarget: number;
  conservationTarget: number;
  profilePageType: ProfilePageType;
  treesDonated: number;
  areaRestored: number;
  areaConserved: number;
}

const ProgressBars = ({
  handleEditTargets,
  treesDonated,
  areaRestored,
  areaConserved,
  treeTarget,
  restorationTarget,
  conservationTarget,
  profilePageType,
}: ProgressBarsProps) => {
  const contributionStats = useMyForestStore(
    (state) => state.contributionStats
  );
  const shouldShowBar = (target: number, contributedUnits: number): boolean =>
    contributedUnits > 0 || target > 0;

  return (
    <>
      {shouldShowBar(treeTarget, treesDonated) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'treesPlanted'}
          target={treeTarget}
          gift={contributionStats?.treesDonated.received ?? 0}
          personal={
            (contributionStats?.treesDonated.personal ?? 0) +
            (contributionStats?.treesRegistered ?? 0)
          }
          profilePageType={profilePageType}
        />
      )}
      {shouldShowBar(restorationTarget, areaRestored) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'areaRestored'}
          target={restorationTarget}
          gift={contributionStats?.areaRestoredInM2.received ?? 0}
          personal={contributionStats?.areaRestoredInM2.personal ?? 0}
          profilePageType={profilePageType}
        />
      )}
      {shouldShowBar(conservationTarget, areaConserved) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'areaConserved'}
          target={conservationTarget}
          gift={contributionStats?.areaConservedInM2.received ?? 0}
          personal={contributionStats?.areaConservedInM2.personal ?? 0}
          profilePageType={profilePageType}
        />
      )}
    </>
  );
};

const ForestProgress = ({ profilePageType }: ForestProgressProp) => {
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const handleEditTargets = () => setIsEditingTargets(true);
  const userInfo = useMyForestStore((state) => state.userInfo);
  const contributionStats = useMyForestStore(
    (state) => state.contributionStats
  );
  const { treesDonated, areaRestored, areaConserved } =
    aggregateProgressData(contributionStats);
  const treeTarget = userInfo?.targets.treesDonated ?? 0;
  const restorationTarget = userInfo?.targets.areaRestored ?? 0;
  const conservationTarget = userInfo?.targets.areaConserved ?? 0;

  const [isProgressEnabled, setIsProgressEnabled] = useState(
    checkProgressEnabled(
      treesDonated,
      areaRestored,
      areaConserved,
      treeTarget,
      restorationTarget,
      conservationTarget
    )
  );

  useEffect(() => {
    setIsProgressEnabled(
      checkProgressEnabled(
        treesDonated,
        areaRestored,
        areaConserved,
        treeTarget,
        restorationTarget,
        conservationTarget
      )
    );
  }, [
    treeTarget,
    restorationTarget,
    conservationTarget,
    treesDonated,
    areaRestored,
    areaConserved,
  ]);

  const progressBarsProps = {
    handleEditTargets,
    treesDonated,
    areaRestored,
    areaConserved,
    treeTarget,
    restorationTarget,
    conservationTarget,
    profilePageType,
  };

  const targets = {
    treeTarget,
    restorationTarget,
    conservationTarget,
  };
  return (
    <div className={styles.progressSection}>
      {isProgressEnabled ? (
        <ProgressBars {...progressBarsProps} />
      ) : (
        <EmptyProgress handleSetTargets={handleEditTargets} />
      )}

      <TargetsModal
        open={isEditingTargets}
        setOpen={setIsEditingTargets}
        {...targets}
      />
    </div>
  );
};

export default ForestProgress;
