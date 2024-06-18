import styles from './ForestProgress.module.scss';
import { getAchievedTarget } from '../../../../utils/myForestV2Utils';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import EditButton from './microComponents/EditButton';
import ProgressData from './microComponents/ProgressData';

export type ProgressDataType =
  | 'treesPlanted'
  | 'areaRestored'
  | 'areaConserved';

export interface ForestProgressItemProps {
  handleEditTargets: () => void;
  dataType: ProgressDataType;
  target: number;
  gift: number;
  personal: number;
}

const ForestProgressItem = ({
  handleEditTargets,
  dataType,
  target,
  gift,
  personal,
}: ForestProgressItemProps) => {
  const { asPath } = useRouter();

  const _getAchievedTarget = useMemo(
    () => getAchievedTarget(target, gift, personal),
    [target, gift, personal]
  );

  return (
    <div className={`${styles.progressMainContainer} ${styles[dataType]}`}>
      {asPath === '/en/profile/mfv2' && (
        <EditButton
          handleEditTargets={handleEditTargets}
          target={target}
          dataType={dataType}
        />
      )}

      <ProgressData
        giftPercentage={Number(_getAchievedTarget.giftPercentage.toFixed(1))}
        personalPercentage={Number(
          _getAchievedTarget.personalPercentage.toFixed(1)
        )}
        gift={Number(gift?.toFixed(1))}
        personal={Number(personal?.toFixed(1))}
        target={target}
        dataType={dataType}
      />
    </div>
  );
};

export default ForestProgressItem;
