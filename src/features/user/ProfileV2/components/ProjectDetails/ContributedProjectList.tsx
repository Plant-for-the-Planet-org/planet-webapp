import getImageUrl from '../../../../../utils/getImageURL';
import { getDonationUrl } from '../../../../../utils/getDonationUrl';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { format } from 'date-fns';
import {
  ProjectProps,
  ContributedProjectListProps,
} from '../../../../common/types/myForest';
import { Button } from '@mui/material';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';
import TreesIcon from '../../../../../../public/assets/images/icons/TreesIcon';
import TreeIcon from '../../../../../../public/assets/images/icons/TreeIcon';

const Project = ({ key, projectInfo }: ProjectProps): ReactElement => {
  const { token } = useUserProps();
  const { embed } = useContext(ParamsContext);
  const { t } = useTranslation(['me', 'country']);
  const handleDonate = (slug: string) => {
    const url = getDonationUrl(slug, token);
    embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  };
  return (
    projectInfo && (
      <div className={myForestStyles.donationDetail} key={key}>
        <div className={myForestStyles.image}>
          {projectInfo?.plantProject !== null ? (
            <img
              src={getImageUrl(
                'project',
                'medium',
                projectInfo.plantProject.image
              )}
              width="100%"
              height="100%"
            />
          ) : (
            <div className={myForestStyles.registerTreeIcon}>
              {projectInfo?.treeCount > 1 ? <TreesIcon /> : <TreeIcon />}
            </div>
          )}
        </div>
        <div className={myForestStyles.projectDetailContainer}>
          <div className={myForestStyles.projectDetail}>
            <div style={{ maxWidth: '345px' }}>
              <p className={myForestStyles.projectName}>
                {projectInfo?.plantProject !== null
                  ? projectInfo.plantProject.name
                  : 'Registered Trees'}
              </p>
              {projectInfo?.plantProject !== null && (
                <div>
                  {t(
                    'country:' + projectInfo.plantProject.country.toLowerCase()
                  )}
                  -{projectInfo.plantProject.tpo.name}
                </div>
              )}
            </div>
            <div className={myForestStyles.treeCount}>
              {projectInfo.purpose === 'conservation'
                ? t('me:area', { areaConserved: `${projectInfo.quantity}` })
                : t('me:plantedTrees', {
                    noOfTrees: `${
                      projectInfo.quantity || projectInfo?.treeCount
                    }`,
                  })}
            </div>
          </div>
          <div className={myForestStyles.donateContainer}>
            <div className={myForestStyles.plantingDate}>
              {format(projectInfo.plantDate, 'MMMM d, yyyy')}
            </div>
            {projectInfo?.plantProject !== null && (
              <div
                className={myForestStyles.donate}
                onClick={() => handleDonate(projectInfo.plantProject.guid)}
              >
                {'Donate Again'}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

const ContributedProjectList = ({
  contributionProjectList,
  setIsLoadButtonActive,
  isLoadButtonActive,
  handleFetchNextPage,
}: ContributedProjectListProps): ReactElement => {
  const { isConservedButtonActive } = useProjectProps();
  const { t } = useTranslation(['me']);
  return (
    <div
      className={myForestStyles.donationlistContainer}
      style={{ marginTop: isConservedButtonActive ? '0px' : '340px' }}
    >
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
              (bouquetProject: any, key) => {
                return <Project key={key} projectInfo={bouquetProject} />;
              }
            );
          }
        });
      })}
      {isLoadButtonActive && (
        <div className={myForestStyles.loadProjectButtonContainer}>
          <Button
            style={{
              maxWidth: 'fit-content',
              backgroundColor: isConservedButtonActive ? '#48AADD' : '',
            }}
            variant="contained"
            onClick={handleFetchNextPage}
          >
            {t('me:loadProjects')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContributedProjectList;
