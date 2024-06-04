import targetBarStyle from '../TreeTargetBar.module.scss';
import { useTranslations } from 'next-intl';

interface TargetInitializeProps {
  handleOpen: () => void;
}

const TargetInitialize = ({ handleOpen }: TargetInitializeProps) => {
  const tProfile = useTranslations('Profile');
  return (
    <div className={targetBarStyle.targetInitializeMainContainer}>
      <div className={targetBarStyle.setTargetLabel}>
        {tProfile('progressBar.targetInfo')}
      </div>
      <button className={targetBarStyle.setTargetButton} onClick={handleOpen}>
        {tProfile('progressBar.setTargets')}
      </button>
    </div>
  );
};

export default TargetInitialize;
