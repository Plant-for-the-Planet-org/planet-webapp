import getImageUrl from '../../../../../utils/getImageURL';
import { getDonationUrl } from '../../../../../utils/getDonationUrl';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useContext } from 'react';
import { useTranslation } from 'next-i18next';

const Project = ({ key, projectInfo }) => {
  const { token } = useUserProps();
  const { embed } = useContext(ParamsContext);
  const { t } = useTranslation(['me']);
  const handleDonate = (slug) => {
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
                {projectInfo.plantProject.countryCode}-
                {projectInfo.plantProject.tpo.name}
              </div>
            </div>
            <div style={{ fontWeight: '700', fontSize: '14px' }}>
              <p>{'24 Aug 2022'}</p>
            </div>
          </div>
          <div className={myForestStyles.donateContainer}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
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
}) => {
  return (
    contributionProjectList && (
      <div
        className={myForestStyles.donationlistContainer}
        style={{ marginTop: isConservedButtonActive ? '0px' : '340px' }}
      >
        {contributionProjectList.map((project, key) => {
          if (project.purpose !== 'bouquet') {
            return <Project key={key} projectInfo={project} />;
          }
        })}

        {contributionProjectList.map((project) => {
          if (project.purpose === 'bouquet') {
            return project?.bouquetContributions?.map((bouquetProject, key) => {
              return <Project key={key} projectInfo={bouquetProject} />;
            });
          }
        })}
      </div>
    )
  );
};

export default ContributedProjectList;
