import {
  TreesPlantedIcon,
  AreaRestoredIcon,
  ConservedAreaIcon,
} from '../../../../../public/assets/images/icons/ProgressBarIcons';
import progressBarStyle from './ForestProgressBar.module.scss';
import { useTranslations } from 'next-intl';
import { getAchievedTarget } from '../../../../utils/myForestV2Utils';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import EditButton from './microComponents/EditButton';
import GiftPercentageBar from './microComponents/GiftPercentageBar';
import PersonalPercentageBar from './microComponents/PersonalPercentage';

export type DataType = 'treesPlanted' | 'areaRestored' | 'areaConserved';

export interface ProgressDataProps {
  giftPercentage: number;
  personalPercentage: number;
  gift: number;
  personal: number;
  dataType: DataType;
  target: number;
}
export interface ForestProgressItemProps {
  handleOpen: () => void;
  dataType: DataType;
  target: number;
  gift: number;
  personal: number;
}

export type BarsProps = Omit<ProgressDataProps, 'dataType'>;

const Bars = ({
  personalPercentage,
  giftPercentage,
  gift,
  personal,
  target,
}: BarsProps) => {
  const totalAchievedPercentage = giftPercentage + personalPercentage;

  const hasDecimalPart =
    totalAchievedPercentage !== Math.floor(totalAchievedPercentage);

  const commonProps = {
    personalPercentage,
    giftPercentage,
    gift,
    personal,
    target,
  };
  return (
    <div className={progressBarStyle.barMainContainer}>
      <div className={progressBarStyle.barContainer}>
        <PersonalPercentageBar {...commonProps} />
        <GiftPercentageBar {...commonProps} />
      </div>
      <div>
        {target > 0 &&
          `${
            hasDecimalPart
              ? totalAchievedPercentage.toFixed(1)
              : totalAchievedPercentage
          }%`}
      </div>
    </div>
  );
};

const GiftReceivedFromCommunity = ({
  gift,
  label,
}: {
  gift: number;
  label: string;
}) => {
  return (
    <>
      {' '}
      {gift !== undefined && gift > 0 && (
        <div className={progressBarStyle.communityReceived}>{label}</div>
      )}
    </>
  );
};

const ProgressData = ({
  giftPercentage,
  personalPercentage,
  gift,
  personal,
  dataType,
  target,
}: ProgressDataProps) => {
  const tProfile = useTranslations('Profile.progressBar');
  const totalAchievment = gift + personal;

  const getLabel = useMemo(() => {
    const isTargetSet = target > 0;
    const targetAchievedUnit =
      totalAchievment !== Math.floor(totalAchievment)
        ? totalAchievment.toFixed(1)
        : totalAchievment;
    const hasDecimalPart = target !== Math.floor(target);
    const _target = hasDecimalPart ? target.toFixed(1) : target;

    switch (dataType) {
      case 'treesPlanted':
        return isTargetSet
          ? tProfile('treeWithTarget', {
              count: targetAchievedUnit,
              total: _target,
            })
          : tProfile('treeWithoutTarget', {
              count: targetAchievedUnit,
            });

      case 'areaRestored':
        return isTargetSet
          ? tProfile('restoreWithTarget', {
              count: targetAchievedUnit,
              unit: _target,
            })
          : tProfile('restoreWithoutTarget', {
              unit: targetAchievedUnit,
            });

      case 'areaConserved':
        return isTargetSet
          ? tProfile('conservWithTarget', {
              count: targetAchievedUnit,
              unit: _target,
            })
          : tProfile('conservWithoutTarget', {
              unit: targetAchievedUnit,
            });

      default:
        return '';
    }
  }, [dataType, target]);

  const getIcon = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return <TreesPlantedIcon width={19} />;
      case 'areaRestored':
        return <AreaRestoredIcon width={17} />;
      case 'areaConserved':
        return <ConservedAreaIcon width={13} />;
    }
  }, [dataType]);

  const commonProps = {
    personalPercentage,
    giftPercentage,
    gift,
    personal,
    target,
  };
  return (
    <div className={progressBarStyle.progressContainer}>
      <div className={progressBarStyle.statisticsMainContainer}>
        <div className={`${progressBarStyle.iconContainer} iconContainer`}>
          {getIcon}
        </div>
        <div className={progressBarStyle.statisticsContainer}>
          <div className={progressBarStyle.stat}>{getLabel}</div>
          <Bars {...commonProps} />
          <GiftReceivedFromCommunity
            gift={gift}
            label={tProfile('totalGiftFromCommunity', {
              quantity: gift,
            })}
          />
        </div>
      </div>
    </div>
  );
};

const ForestProgressItem = ({
  handleOpen,
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
    <div className={`${progressBarStyle.progressMainContainer} ${dataType}`}>
      {asPath === '/en/profile/mfv2' && (
        <EditButton
          handleOpen={handleOpen}
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
