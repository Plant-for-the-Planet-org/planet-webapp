import WebappButton from '../../../common/WebappButton';
import targetBarStyle from './ForestProgress.module.scss';
import { useTranslations } from 'next-intl';

interface EmptyProgressProps {
  handleOpen: () => void;
}

const EmptyProgress = ({ handleOpen }: EmptyProgressProps) => {
  const tProfile = useTranslations('Profile.progressBar');
  return (
    <div className={targetBarStyle.emptyProgressContainer}>
      <div className={targetBarStyle.setTargetLabel}>
        {tProfile('setTargetsEnvironmentalActions')}
      </div>
      <WebappButton
        variant="primary"
        text={tProfile('setTargets')}
        onClick={handleOpen}
        elementType="button"
      />
    </div>
  );
};

export default EmptyProgress;
