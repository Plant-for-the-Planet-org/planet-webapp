import {
  EditTargetIcon,
  TreesPlantedIcon,
  AreaRestoredIcon,
  ConservedAreaIcon,
} from '../../../../../../public/assets/images/icons/ProgressBarIcons';
import ProgressBarStyle from '../TreeTargetBar.module.scss';
import themeProperties from '../../../../../theme/themeProperties';
import { useTranslations } from 'next-intl';
import { getAchievedTarget } from '../../../../../utils/myForestV2Utils';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

type DataType = 'treesPlanted' | 'areaRestored' | 'areaConserved';

type EditButtonProp = Omit<
  ForestProgressItemProps,
  'gift' | 'personal' | 'checked'
>;
export interface ProgressDataProps {
  giftPercentage: number;
  personalPercentage: number;
  gift: number;
  personal: number;
  dataType: DataType;
  target: number;
  checked: boolean;
}
interface ForestProgressItemProps {
  handleOpen: () => void;
  dataType: DataType;
  target: number;
  gift: number;
  personal: number;
  checked: boolean;
}

const EditButton = ({ handleOpen, target, dataType }: EditButtonProp) => {
  const tProfile = useTranslations('Profile');
  const { primaryDarkColor, electricPurpleColor, mediumBlueColor } =
    themeProperties;
  const getDarkerColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return primaryDarkColor;
      case 'areaRestored':
        return electricPurpleColor;
      case 'areaConserved':
        return mediumBlueColor;
      default:
        return '';
    }
  }, [dataType]);

  return (
    <div className={ProgressBarStyle.editTargetButtonContainer}>
      <button
        className={ProgressBarStyle.editTargetContainer}
        onClick={handleOpen}
      >
        <EditTargetIcon width={9} color={getDarkerColor} />
        <p
          className={ProgressBarStyle.editTargetLabel}
          style={{ color: getDarkerColor }}
        >
          {target > 0
            ? tProfile('progressBar.editTarget')
            : tProfile('progressBar.setTarget')}
        </p>
      </button>
    </div>
  );
};

const ProgressData = ({
  giftPercentage,
  personalPercentage,
  gift,
  personal,
  dataType,
  target,
  checked,
}: ProgressDataProps) => {
  const tProfile = useTranslations('Profile');
  const totalAchievment = gift + personal;
  const {
    primaryDarkColor,
    electricPurpleColor,
    mediumBlueColor,
    mintGreenColor,
    lavenderPurpleColor,
    skyBlueColor,
  } = themeProperties;

  const getDarkerColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return { background: `${primaryDarkColor}` };
      case 'areaRestored':
        return { background: `${electricPurpleColor}` };
      case 'areaConserved':
        return { background: `${mediumBlueColor}` };
      default:
        return {};
    }
  }, [dataType]);

  const getGiftBarColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return { background: `${mintGreenColor}` };
      case 'areaRestored':
        return { background: `${lavenderPurpleColor}` };
      case 'areaConserved':
        return { background: `${skyBlueColor}` };
      default:
        return {};
    }
  }, [dataType]);

  const getLabel = useMemo(() => {
    const isTargetSet = target > 0 && checked;
    const targetAchieveUnit =
      totalAchievment !== Math.floor(totalAchievment)
        ? totalAchievment.toFixed(1)
        : totalAchievment;
    const _target = target !== Math.floor(target) ? target.toFixed(1) : target;

    switch (dataType) {
      case 'treesPlanted':
        return isTargetSet
          ? tProfile('progressBar.treeWithTarget', {
              count: targetAchieveUnit,
              total: _target,
            })
          : tProfile('progressBar.treeWithoutTarget', {
              count: targetAchieveUnit,
            });

      case 'areaRestored':
        return isTargetSet
          ? tProfile('progressBar.restoreWithTarget', {
              count: targetAchieveUnit,
              unit: _target,
            })
          : tProfile('progressBar.restoreWithoutTarget', {
              unit: targetAchieveUnit,
            });

      case 'areaConserved':
        return isTargetSet
          ? tProfile('progressBar.conservWithTarget', {
              count: targetAchieveUnit,
              unit: _target,
            })
          : tProfile('progressBar.conservWithoutTarget', {
              unit: targetAchieveUnit,
            });

      default:
        return '';
    }
  }, [dataType, checked, target]);

  const getIcon = useMemo(() => {
    const iconProps = { width: 19 };

    switch (dataType) {
      case 'treesPlanted':
        return <TreesPlantedIcon {...iconProps} />;
      case 'areaRestored':
        return <AreaRestoredIcon {...iconProps} />;
      case 'areaConserved':
        return <ConservedAreaIcon {...iconProps} />;
      default:
        return null;
    }
  }, [dataType]);
  const PersonalPercentage = () => {
    return (
      <div
        style={{
          width: `${personalPercentage}%`,
          borderTopRightRadius: `${
            giftPercentage !== 0 || target > totalAchievment ? 0 : 5
          }px`,
          borderBottomRightRadius: `${
            giftPercentage !== 0 || target > totalAchievment ? 0 : 5
          }px`,
          ...getDarkerColor,
        }}
        className={ProgressBarStyle.personalPercentageBar}
      ></div>
    );
  };

  const GiftPercentage = () => {
    return (
      <div
        style={{
          width: `${giftPercentage}%`,
          borderTopRightRadius: `${target > gift ? 0 : 5}px`,
          borderBottomRightRadius: `${target > gift ? 0 : 5}px`,
          borderTopLeftRadius: `${personalPercentage === 0 ? 5 : 0}px`,
          borderBottomLeftRadius: `${personalPercentage === 0 ? 5 : 0}px`,
          ...getGiftBarColor,
        }}
        className={ProgressBarStyle.giftPercentageBar}
      ></div>
    );
  };

  const Bar = () => {
    return (
      <div className={ProgressBarStyle.barMainContainer}>
        <div className={ProgressBarStyle.barContainer}>
          <PersonalPercentage />
          <GiftPercentage />
        </div>
        <div>{target > 0 && `${giftPercentage + personalPercentage}%`}</div>
      </div>
    );
  };

  const GiftReceived = () => {
    return (
      <>
        {' '}
        {gift !== undefined && gift > 0 && (
          <div className={ProgressBarStyle.communityReceived}>
            {tProfile('progressBar.totalGiftFromCommunity', {
              quantity: gift,
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={ProgressBarStyle.progressContainer}>
      <div className={ProgressBarStyle.statisticsMainContainer}>
        <div className={ProgressBarStyle.iconContainer} style={getDarkerColor}>
          {getIcon}
        </div>
        <div className={ProgressBarStyle.statisticsContainer}>
          <div className={ProgressBarStyle.stat}>{getLabel}</div>
          <Bar />
          <GiftReceived />
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
  checked,
}: ForestProgressItemProps) => {
  const { asPath } = useRouter();
  const { greenHaze, amethystPurpleColor, ceruleanBlueColor } = themeProperties;
  const _getAchievedTarget = useMemo(
    () => getAchievedTarget(target, gift, personal),
    [target, gift, personal]
  );

  const getLighterColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return { background: `${greenHaze}` };
      case 'areaRestored':
        return { background: `${amethystPurpleColor}` };
      case 'areaConserved':
        return { background: `${ceruleanBlueColor}` };
      default:
        return {};
    }
  }, [dataType]);

  return (
    <div
      className={ProgressBarStyle.progressMainContainer}
      style={getLighterColor}
    >
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
        checked={checked}
      />
    </div>
  );
};

export default ForestProgressItem;
