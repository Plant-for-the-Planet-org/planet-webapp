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
} from '../../../../common/types/contribution';

const Project = ({ key, projectInfo }: ProjectProps): ReactElement => {
  const { token } = useUserProps();
  const { embed } = useContext(ParamsContext);
  const { t } = useTranslation(['me']);
  const handleDonate = (slug: string) => {
    const url = getDonationUrl(slug, token);
    embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  };
  return (
    projectInfo && (
      <div className={myForestStyles.donationDetail} key={key}>
        <div className={myForestStyles.image}>
          <img
            src={getImageUrl(
              'project',
              'medium',
              projectInfo.plantProject.image
            )}
            width="100%"
            height="100%"
          />
        </div>
        <div className={myForestStyles.projectDetailContainer}>
          <div className={myForestStyles.projectDetail}>
            <div>
              <p className={myForestStyles.projectName}>
                {projectInfo.plantProject.name}
              </p>
              <div>
                {projectInfo.plantProject.country}-
                {projectInfo.plantProject.tpo.name}
              </div>
            </div>
            <div className={myForestStyles.plantingDate}>
              <p> {format(projectInfo.plantDate, 'MMMM d, yyyy')}</p>
            </div>
          </div>
          <div className={myForestStyles.donateContainer}>
            <div className={myForestStyles.treeCount}>
              {projectInfo.purpose === 'conservation'
                ? t('me:area', { areaConserved: `${projectInfo.quantity}` })
                : t('me:plantedTrees', {
                    noOfTrees: `${projectInfo.quantity}`,
                  })}
            </div>
            <div
              className={myForestStyles.donate}
              onClick={() => handleDonate(projectInfo.plantProject.guid)}
            >
              {'Donate Again'}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const ContributedProjectList = ({
  isConservedButtonActive,
  contributionProjectList,
}: ContributedProjectListProps): ReactElement => {
  return (
    contributionProjectList && (
      <div
        className={myForestStyles.donationlistContainer}
        style={{ marginTop: isConservedButtonActive ? '0px' : '340px' }}
      >
        {contributionProjectList.map((project: any, key: number) => {
          if (project.purpose !== 'bouquet') {
            return <Project key={key} projectInfo={project} />;
          }
        })}

        {contributionProjectList.map((project: any) => {
          if (project.purpose === 'bouquet') {
            return project?.bouquetContributions?.map(
              (bouquetProject: any, key: number) => {
                return <Project key={key} projectInfo={bouquetProject} />;
              }
            );
          }
        })}
      </div>
    )
  );
};

export default ContributedProjectList;
