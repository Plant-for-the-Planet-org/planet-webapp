import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';
import { Contributions } from '../../../../common/types/myForest';
import { useContext, ReactElement } from 'react';
import myForestStyles from '../../styles/MyForest.module.scss';
import TreesIcon from '../../../../../../public/assets/images/icons/TreesIcon';
import TreeIcon from '../../../../../../public/assets/images/icons/TreeIcon';
import getImageUrl from '../../../../../utils/getImageURL';
import { useTranslation } from 'next-i18next';
import { getDonationUrl } from '../../../../../utils/getDonationUrl';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';

export interface ProjectProps {
  projectInfo: Contributions;
}

const ContributedProject = ({ projectInfo }: ProjectProps): ReactElement => {
  const { token } = useUserProps();
  const { embed } = useContext(ParamsContext);
  const { t } = useTranslation(['me', 'country']);

  const handleDonate = (slug: string) => {
    const url = getDonationUrl(slug, token);
    embed === 'true'
      ? window.open(url, '_blank')
      : (window.location.href = url);
  };

  return projectInfo ? (
    <div className={myForestStyles.donationDetail}>
      <div className={myForestStyles.image}>
        {projectInfo?.plantProject !== null &&
        projectInfo?.plantProject?.image !== null ? (
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
            {projectInfo?.treeCount && projectInfo?.treeCount > 1 ? (
              <TreesIcon />
            ) : (
              <TreeIcon />
            )}
          </div>
        )}
      </div>
      <div className={myForestStyles.projectDetailContainer}>
        <div className={myForestStyles.projectDetail}>
          <div>
            <div className={myForestStyles.projectName}>
              {projectInfo?.plantProject !== null
                ? projectInfo.plantProject.name
                : t('me:registeredTree')}
            </div>
            {projectInfo?.plantProject !== null && (
              <div>
                {t('country:' + projectInfo.plantProject.country.toLowerCase())}
                -{projectInfo.plantProject.tpo.name}
              </div>
            )}
          </div>
          <div className={myForestStyles.treeCount}>
            {projectInfo?.plantProject?.unit === 'm2'
              ? t('me:area', { areaConserved: `${projectInfo.quantity}` })
              : t('me:plantedTrees', {
                  count:
                    projectInfo.quantity ||
                    parseInt(`${projectInfo?.treeCount}`) ||
                    0,
                })}
          </div>
        </div>
        <div className={myForestStyles.donateContainer}>
          <div className={myForestStyles.plantingDate}>
            {formatDate(projectInfo.plantDate)}
          </div>
          {projectInfo?.plantProject !== null && (
            <div
              className={myForestStyles.donate}
              onClick={() => handleDonate(projectInfo.plantProject.guid)}
            >
              {t('me:donateAgain')}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ContributedProject;
