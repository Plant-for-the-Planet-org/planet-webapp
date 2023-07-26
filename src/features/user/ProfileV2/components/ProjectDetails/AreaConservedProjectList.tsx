import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import ContributedProjectList from './ContributedProjectList';
import { Contributions } from '../../../../common/types/contribution';
import { ReactElement } from 'react';
import { AreaConservedProjectListProps } from '../../../../common/types/contribution';
import { Button } from '@mui/material';

const AreaConservedProjectList = ({
  contribution,
  isConservedButtonActive,
  handleFetchNextPage,
}: AreaConservedProjectListProps): ReactElement => {
  const { t } = useTranslation(['me']);
  const [contributionProjectList, setContributionProjectList] = useState<
    Contributions[]
  >([]);
  const [isLoadButtonActive, setIsLoadButtonActive] = useState(true);

  useEffect(() => {
    const data: Contributions[] = [];
    const _fetchProjectlist = () => {
      const _fetchConservAreaProjects = contribution.map((singlePageData) => {
        if (singlePageData?.nextCursor === undefined)
          setIsLoadButtonActive(false);
        return singlePageData?.data.filter((singleProject: Contributions) => {
          if (singleProject.purpose === 'conservation') return singleProject;
        });
      });

      if (_fetchConservAreaProjects) {
        _fetchConservAreaProjects.map((singleProject) => {
          data.push(singleProject);
        });
        setContributionProjectList(data);
      }
    };
    if (contribution) _fetchProjectlist();
  }, [contribution]);

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
        {isLoadButtonActive && (
          <div className={myForestStyles.loadProjectButtonContainer}>
            <Button variant="contained" onClick={handleFetchNextPage}>
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaConservedProjectList;
