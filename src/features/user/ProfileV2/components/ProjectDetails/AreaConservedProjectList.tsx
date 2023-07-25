import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import ContributedProjectList from './ContributedProjectList';
import { Contributions } from '../../../../common/types/contribution';
import { ReactElement } from 'react';
import { AreaConservedProjectListProps } from '../../../../common/types/contribution';

const AreaConservedProjectList = ({
  contribution,
  isConservedButtonActive,
}: AreaConservedProjectListProps): ReactElement => {
  const { t } = useTranslation(['me']);
  const [contributionProjectList, setContributionProjectList] = useState<
    Contributions[]
  >([]);

  useEffect(() => {
    if (contribution) {
      const _conservationProjects = contribution.filter(
        (project: Contributions) => {
          if (project.purpose === 'conservation') return project;
        }
      );
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
