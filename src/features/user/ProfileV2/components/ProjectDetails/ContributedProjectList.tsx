import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { Contributions } from '../../../../common/types/myForest';
import { Button } from '@mui/material';
import ContributedProject from '../MicroComponents/ContributedProject';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';

export interface ContributedProjectListProps {
  handleFetchNextPage: () => void;
  contributionProjectList: Contributions[];
}

const ContributedProjectList = ({
  contributionProjectList,
  handleFetchNextPage,
}: ContributedProjectListProps): ReactElement => {
  const { isConservedButtonActive } = useUserProps();
  const { t } = useTranslation(['me']);

  const _isLoadButtonActive = contributionProjectList.some((singlePage) => {
    return singlePage?.nextCursor === undefined;
  });

  return contributionProjectList ? (
    <div className={myForestStyles.donationlistContainer}>
      {contributionProjectList.map((singlePage: any) => {
        return singlePage?.data?.map((singleProject: any, key) => {
          if (singleProject.purpose !== 'bouquet') {
            return <ContributedProject key={key} projectInfo={singleProject} />;
          }
        });
      })}

      {contributionProjectList.map((singlePage: any) => {
        return singlePage?.data?.map((singleProject: any) => {
          if (singleProject.purpose === 'bouquet') {
            return singleProject.bouquetContributions.map(
              (bouquetProject: Contributions, key) => {
                return (
                  <ContributedProject key={key} projectInfo={bouquetProject} />
                );
              }
            );
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
