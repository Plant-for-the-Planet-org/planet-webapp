import myForestStyles from '../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import ContributedProjectList from './ContributedProjectList';

const AreaConservedProjectList = ({ isConservedButtonActive }) => {
  const { t } = useTranslation(['me']);
  return (
    <div className={myForestStyles.AreaConservedMainContainer}>
      <div className={myForestStyles.textContainer}>
        <div className={myForestStyles.conservedAreaText}>
          <p>{t('me:areaConserved')}</p>
          <p className={myForestStyles.hrLine} />
        </div>
      </div>
      <div className={myForestStyles.AreaConservedContainer}>
        <ContributedProjectList
          isConservedButtonActive={isConservedButtonActive}
          contributionProjectList={undefined}
        />
      </div>
    </div>
  );
};

export default AreaConservedProjectList;
