import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';
import {
  Contributions,
  BouquetContribution,
} from '../../../../common/types/myForest';
import { useContext, ReactElement } from 'react';
import myForestStyles from '../../styles/MyForest.module.scss';
import TreesIcon from '../../../../../../public/assets/images/icons/TreesIcon';
import TreeIcon from '../../../../../../public/assets/images/icons/TreeIcon';
import getImageUrl from '../../../../../utils/getImageURL';
import { useTranslation } from 'next-i18next';
import { getDonationUrl } from '../../../../../utils/getDonationUrl';
import format from 'date-fns/format';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';

export interface ProjectProps {
  projectInfo: Contributions | BouquetContribution;
}

const ContributedProject = ({ projectInfo }: ProjectProps): ReactElement => {
  const { token } = useUserProps();
  const { embed } = useContext(ParamsContext);
  const { t } = useTranslation(['me', 'country']);

  const handleDonate = (id: string, tenant: string) => {
    const url = getDonationUrl(tenant, id, token);
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
          <div className={myForestStyles.projectDetailMain}>
            <div className={myForestStyles.projectName}>
              {projectInfo?.plantProject !== null
                ? projectInfo.plantProject.name
                : t('me:registeredTree')}
            </div>
            {projectInfo?.plantProject !== null && (
              <div className={myForestStyles.sepratorContainer}>
                <div>
                  {t(
                    'country:' + projectInfo.plantProject.country.toLowerCase()
                  )}
                </div>
                <div className={myForestStyles.dotSeprator}>.</div>
                <div className={myForestStyles.tpoName}>
                  {projectInfo.plantProject.tpo.name}
                </div>
              </div>
            )}
          </div>

          <div className={myForestStyles.plantingDate}>
            {format(projectInfo.plantDate, 'MMM dd, yyyy', {
              locale:
                localeMapForDate[localStorage.getItem('language') || 'en'],
            })}
          </div>
        </div>
        <div className={myForestStyles.donateContainer}>
          <time className={myForestStyles.treeCount}>
            {projectInfo?.plantProject?.unit === 'm2'
              ? t('me:areaType', {
                  areaConserved: `${projectInfo.quantity}`,
                  type: `${
                    projectInfo.purpose === 'trees' ? 'restored' : 'conserved'
                  } `,
                })
              : t('me:plantedTrees', {
                  count:
                    projectInfo.quantity ||
                    parseInt(`${projectInfo?.treeCount}`) ||
                    0,
                })}
          </time>
          {projectInfo.contributionType === 'donation' && (
            <div
              className={myForestStyles.donate}
              onClick={() =>
                handleDonate(
                  projectInfo.plantProject.guid,
                  projectInfo.tenant.guid
                )
              }
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
