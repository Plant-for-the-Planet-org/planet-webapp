import type { ProfilePageType } from '../../../common/types/myForest';

import { useState, useEffect } from 'react';
import styles from './ForestProgress.module.scss';
import TargetsModal from './TargetsModal';
import { useMyForest } from '../../../common/Layout/MyForestContext';
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
  restoreTarget: number;
  conservTarget: number;
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
  restoreTarget,
  conservTarget,
  profilePageType,
}: ProgressBarsProps) => {
  const { userInfo } = useMyForest();

  const shouldShowBar = (target: number, contributedUnits: number): boolean =>
    contributedUnits > 0 || target > 0;

  return (
    <>
      {shouldShowBar(treeTarget, treesDonated) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'treesPlanted'}
          target={treeTarget}
          gift={userInfo?.scores.treesDonated.received ?? 0}
          personal={
            (userInfo?.scores.treesDonated.personal ?? 0) +
            (userInfo?.scores.treesPlanted ?? 0)
          }
          profilePageType={profilePageType}
        />
      )}
      {shouldShowBar(restoreTarget, areaRestored) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'areaRestored'}
          target={restoreTarget}
          gift={userInfo?.scores.areaRestored.received ?? 0}
          personal={userInfo?.scores.areaRestored.personal ?? 0}
          profilePageType={profilePageType}
        />
      )}
      {shouldShowBar(conservTarget, areaConserved) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'areaConserved'}
          target={conservTarget}
          gift={userInfo?.scores.areaConserved.received ?? 0}
          personal={userInfo?.scores.areaConserved.personal ?? 0}
          profilePageType={profilePageType}
        />
      )}
    </>
  );
};

const ForestProgress = ({ profilePageType }: ForestProgressProp) => {
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const handleEditTargets = () => setIsEditingTargets(true);

  const { userInfo } = useMyForest();

  const { treesDonated, areaRestored, areaConserved } = aggregateProgressData(
    userInfo?.scores
  );
  const treeTarget = userInfo?.scores.treesDonated.target ?? 0;
  const restoreTarget = userInfo?.scores.areaRestored.target ?? 0;
  const conservTarget = userInfo?.scores.areaConserved.target ?? 0;

  const [isProgressEnabled, setIsProgressEnabled] = useState(
    checkProgressEnabled(
      treesDonated,
      areaRestored,
      areaConserved,
      treeTarget,
      restoreTarget,
      conservTarget
    )
  );

  useEffect(() => {
    setIsProgressEnabled(
      checkProgressEnabled(
        treesDonated,
        areaRestored,
        areaConserved,
        treeTarget,
        restoreTarget,
        conservTarget
      )
    );
  }, [
    treeTarget,
    restoreTarget,
    conservTarget,
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
    restoreTarget,
    conservTarget,
    profilePageType,
  };

  const targets = {
    treeTarget,
    restoreTarget,
    conservTarget,
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
