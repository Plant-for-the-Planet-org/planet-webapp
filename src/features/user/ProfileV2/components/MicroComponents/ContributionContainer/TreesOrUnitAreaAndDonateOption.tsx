import myForestStyles from '../../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { getDonationUrl } from '../../../../../../utils/getDonationUrl';
import { ParamsContext } from '../../../../../common/Layout/QueryParamsContext';
import { useUserProps } from '../../../../../common/Layout/UserPropsContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';

interface TreesOrUnitAreaAndDonateOptionProps {
  publicProfileSlug: string;
  projectUnit: string;
  projectPurpose: string | null;
  quantity: number | null;
  contributionType: string | boolean;
  gift: boolean;
  tenantId: string;
  projectGUID: string;
  isDonatable: boolean;
  countryName: string;
  tpoName: string;
}

const TreesOrUnitAreaAndDonateOption = ({
  publicProfileSlug,
  projectUnit,
  projectPurpose,
  quantity,
  contributionType,
  gift,
  tenantId,
  projectGUID,
  isDonatable,
  countryName,
  tpoName,
}: TreesOrUnitAreaAndDonateOptionProps) => {
  const { t } = useTranslation(['me']);
  const { embed } = useContext(ParamsContext);
  const { token } = useUserProps();
  const router = useRouter();
  const { asPath } = router;
  const handleDonate = (id: string, tenant: string) => {
    const url = getDonationUrl(
      tenant,
      id,
      token,
      undefined,
      undefined,
      asPath !== '/profile' ? publicProfileSlug : undefined
    );
    embed === 'true'
      ? window.open(url, '_blank')
      : (window.location.href = url);
  };
  return (
    <div className={myForestStyles.donateContainer}>
      <div>
        <time className={myForestStyles.treeCount}>
          {gift && //for gift contribution
            t('me:plantedTrees', {
              count: parseInt(`${quantity}`) || quantity || 0,
            })}
          {projectPurpose === 'trees' && // tree plantation contribution
            projectUnit === 'tree' &&
            t('me:plantedTrees', {
              count: parseInt(`${quantity}`) || 0,
            })}
          {(projectPurpose === 'trees' || projectPurpose === 'conservation') && //for restoration  &  conservationcontribution
            projectUnit === 'm2' &&
            t('me:areaType', {
              areaConserved: `${quantity}`,
              type: `${
                projectPurpose === 'trees'
                  ? t('me:restoredSmall')
                  : t('me:conservedSmall')
              } `,
            })}
          {contributionType === 'planting' &&
            countryName &&
            tpoName && //for register  tree contribution
            t('me:registeredPlantedTrees', {
              count: Number(`${quantity?.toFixed(2)}`) || 0,
            })}
        </time>
      </div>
      {contributionType && contributionType !== 'planting' && isDonatable && (
        <div
          className={
            projectPurpose === 'conservation'
              ? myForestStyles.donateConserv
              : myForestStyles.donate
          }
          onClick={() => handleDonate(projectGUID, tenantId)}
        >
          {gift || router.asPath !== '/profile'
            ? t('me:donate')
            : t('me:donateAgain')}
        </div>
      )}
    </div>
  );
};

export default TreesOrUnitAreaAndDonateOption;
