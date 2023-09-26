import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { Button } from '@mui/material';
import ContributedProject from '../MicroComponents/ContributedProject';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { Page } from '../../../../common/types/myForest';

export interface ContributedProjectListProps {
  handleFetchNextPage: () => void;
  contributionProjectList: Page[] | undefined;
}

const ContributedProjectList = ({
  contributionProjectList,
  handleFetchNextPage,
}: ContributedProjectListProps): ReactElement => {
  const { isConservedButtonActive } = useUserProps();
  const { t } = useTranslation(['me']);

  const _isLoadButtonActive =
    contributionProjectList &&
    contributionProjectList.some((singlePage) => {
      return singlePage?.nextCursor === undefined;
    });

  return contributionProjectList ? (
    <div className={myForestStyles.donationlistContainer}>
      {contributionProjectList.map((singlePage) => {
        return singlePage?.data?.map((singleProject, key) => {
          if (singleProject.purpose !== 'bouquet') {
            return <ContributedProject key={key} projectInfo={singleProject} />;
          }
        });
      })}

      {contributionProjectList.map((singlePage) => {
        return singlePage?.data?.map((singleProject) => {
          if (singleProject.purpose === 'bouquet') {
            if (singleProject.bouquetContributions) {
              return singleProject.bouquetContributions.map(
                (bouquetProject, key) => {
                  return (
                    <ContributedProject
                      key={key}
                      projectInfo={bouquetProject}
                    />
                  );
                }
              );
            }
          }
        });
      })}
      {!_isLoadButtonActive && (
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
