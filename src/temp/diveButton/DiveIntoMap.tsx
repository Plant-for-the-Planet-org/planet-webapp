import DiveIcon from '../icons/DiveIcon';
import style from './DiveIntoMap.module.scss';
import { useTranslation } from 'next-i18next';

interface DiveIntoMapProps {
  active: boolean;
}

const DiveIntoMap = ({ active }: DiveIntoMapProps) => {
  const { t } = useTranslation(['projectDetails']);
  return (
    <div className={style.diveIntoMapMainContainer}>
      <button className={style.diveIntoProjectButton}>
        <div className={style.diveIconContainer}>
          <DiveIcon />
        </div>
        <div className={style.label}>
          {t('projectDetails:diveIntoTheProject')}
        </div>
      </button>
    </div>
  );
};

export default DiveIntoMap;
