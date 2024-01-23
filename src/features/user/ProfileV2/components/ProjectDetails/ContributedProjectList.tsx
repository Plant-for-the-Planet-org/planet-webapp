import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { Button } from '@mui/material';
import ContributedToProject from '../MicroComponents/ContributedToProject';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { Page } from '../../../../common/types/myForest';
import { useMyForest } from '../../../../common/Layout/MyForestContext';

export interface ContributedProjectListProps {
  hasNextPage: boolean | undefined;
  handleFetchNextPage: () => void | undefined;
  contributionProjectList: Page[] | undefined;
}

const ContributedProjectList = ({
  profile,
  hasNextPage,
  contributionProjectList,
  handleFetchNextPage,
}: ContributedProjectListProps): ReactElement => {
  const { isConservedButtonActive, isProcessing, setIsProcessing } =
    useMyForest();
  const { t } = useTranslation(['me']);

  return contributionProjectList ? (
    <div className={myForestStyles.donationlistContainer}>
      {contributionProjectList.map((singlePage) => {
        return singlePage?.data?.map((singleProject, key) => {
          if (singleProject.purpose !== 'bouquet') {
            return (
              <ContributedToProject
                key={key}
                projectInfo={singleProject}
                profile={profile}
              />
            );
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
                    <ContributedToProject
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
      {hasNextPage && (
        <div className={myForestStyles.loadProjectButtonContainer}>
          <Button
            className={
              isConservedButtonActive
                ? myForestStyles.loadconservation
                : myForestStyles.loadTreePlantaion
            }
            variant="contained"
            disabled={isProcessing}
            onClick={() => {
              setIsProcessing(true);
              handleFetchNextPage();
            }}
          >
            {isProcessing
              ? t('me:loadingContributions')
              : t('me:loadContributions')}
          </Button>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};

export default ContributedProjectList;
