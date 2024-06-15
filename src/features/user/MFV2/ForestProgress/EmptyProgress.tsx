import targetBarStyle from './ForestProgressBar.module.scss';
import { useTranslations } from 'next-intl';

interface EmptyProgressProps {
  handleOpen: () => void;
}

const EmptyProgress = ({ handleOpen }: EmptyProgressProps) => {
  const tProfile = useTranslations('Profile');
  return (
    <div className={targetBarStyle.emptyProgressContainer}>
      <div className={targetBarStyle.setTargetLabel}>
        {tProfile('progressBar.targetInfo')}
      </div>
      <button className={targetBarStyle.setTargetButton} onClick={handleOpen}>
        {tProfile('progressBar.setTargets')}
      </button>
    </div>
  );
};

export default EmptyProgress;
