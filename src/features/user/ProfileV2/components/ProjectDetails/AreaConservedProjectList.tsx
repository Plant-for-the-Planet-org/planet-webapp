import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import ContributedProjectList from './ContributedProjectList';

const AreaConservedProjectList = ({
  contribution,
  isConservedButtonActive,
}) => {
  const { t } = useTranslation(['me']);
  const [contributionProjectList, setContributionProjectList] = useState([]);

  useEffect(() => {
    if (contribution) {
      const _conservationProjects = contribution.filter((project) => {
        if (project.purpose === 'conservation') return project;
      });
      if (_conservationProjects)
        setContributionProjectList(_conservationProjects);
    }
  }, []);

  const projectListProps = {
    isConservedButtonActive,
    contributionProjectList,
  };

  return (
    <div className={myForestStyles.AreaConservedMainContainer}>
      <div className={myForestStyles.textContainer}>
        <div className={myForestStyles.conservedAreaText}>
          <p>{t('me:areaConserved')}</p>
          <p className={myForestStyles.hrLine} />
        </div>
      </div>
      <div className={myForestStyles.AreaConservedContainer}>
        <ContributedProjectList {...projectListProps} />
      </div>
    </div>
  );
};

export default AreaConservedProjectList;
