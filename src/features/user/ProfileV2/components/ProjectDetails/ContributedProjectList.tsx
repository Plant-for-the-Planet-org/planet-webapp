import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import {
  ContributedProjectListProps,
  Contributions,
} from '../../../../common/types/myForest';
import { Button } from '@mui/material';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';
import Project from '../MicroComponents/Project';

const ContributedProjectList = ({
  contributionProjectList,
  setIsLoadButtonActive,
  isLoadButtonActive,
  handleFetchNextPage,
}: ContributedProjectListProps): ReactElement => {
  const { isConservedButtonActive } = useProjectProps();
  const { t } = useTranslation(['me']);

  return contributionProjectList ? (
    <div className={myForestStyles.donationlistContainer}>
      {contributionProjectList.map((singlePage: any) => {
        if (singlePage?.nextCursor === undefined) {
          setIsLoadButtonActive(false);
        } else {
          setIsLoadButtonActive(true);
        }
        return singlePage?.data?.map((singleProject: any, key) => {
          if (singleProject.purpose !== 'bouquet') {
            return <Project key={key} projectInfo={singleProject} />;
          }
        });
      })}

      {contributionProjectList.map((singlePage: any) => {
        return singlePage?.data?.map((singleProject: any) => {
          if (singleProject.purpose === 'bouquet') {
            return singleProject.bouquetContributions.map(
              (bouquetProject: Contributions, key) => {
                return <Project key={key} projectInfo={bouquetProject} />;
              }
            );
          }
        });
      })}
      {isLoadButtonActive && (
        <div className={myForestStyles.loadProjectButtonContainer}>
          <Button
            className={
              isConservedButtonActive
                ? myForestStyles.loadconservation
                : myForestStyles.loadTreePlantaion
            }
            variant="contained"
            onClick={handleFetchNextPage}
          >
            {t('me:loadProjects')}
          </Button>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};

export default ContributedProjectList;
