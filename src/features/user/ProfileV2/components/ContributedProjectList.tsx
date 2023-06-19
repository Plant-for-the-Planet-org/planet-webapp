import getImageUrl from '../../../../utils/getImageURL';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import myForestStyles from '../styles/MyForest.module.scss';
import { useContext } from 'react';

const ContributedProjectList = ({
  isConservedButtonActive,
  contributionProjectList,
}) => {
  const { token } = useUserProps();
  const { embed } = useContext(ParamsContext);
  const handleDonate = (slug) => {
    const url = getDonationUrl(slug, token);
    embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  };
  return (
    contributionProjectList && (
      <div
        className={myForestStyles.donationlistContainer}
        style={{ marginTop: isConservedButtonActive ? '0px' : '340px' }}
      >
        {contributionProjectList.map((project) => {
          return (
            <div
              className={myForestStyles.donationDetail}
              key={project.plantProject.guid}
            >
              <div className={myForestStyles.image}>
                <img
                  src={getImageUrl(
                    'project',
                    'medium',
                    project.plantProject.image
                  )}
                  width="100%"
                  height="100%"
                />
              </div>
              <div className={myForestStyles.projectDetailContainer}>
                <div className={myForestStyles.projectDetail}>
                  <div>
                    <p className={myForestStyles.projectName}>
                      {project.plantProject.name}
                    </p>
                    {/* <p>{project.plantProject.description}</p> */}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>
                    <p>{'Aug 25, 2021'}</p>
                  </div>
                </div>
                <div className={myForestStyles.donateContainer}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {`${project.treeCount} trees`}
                  </div>
                  <div
                    className={myForestStyles.donate}
                    onClick={() => handleDonate(project.plantProject.guid)}
                  >
                    {'Donate Again'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )
  );
};

export default ContributedProjectList;
