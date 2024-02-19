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
  const { t } = useTranslation(['profile']);
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

  const _checkConditions = () => {
    if (gift && asPath === '/profile') {
      const _label = t('profile:myContributions.donate');
      return _label;
    } else if (asPath !== '/profile') {
      const _label = t('profile:myContributions.donate');
      return _label;
    } else {
      const _label = t('profile:myContributions.donateAgain');
      return _label;
    }
  };
  return (
    <div className={myForestStyles.donateContainer}>
      <div>
        <time className={myForestStyles.treeCount}>
          {gift && //for gift contribution
            t('profile:myForestMap.plantedTree', {
              count: parseInt(`${quantity}`) || quantity || 0,
            })}
          {projectPurpose === 'trees' && // tree plantation contribution
            projectUnit === 'tree' &&
            t('profile:myForestMap.plantedTree', {
              count: parseInt(`${quantity}`) || 0,
            })}
          {(projectPurpose === 'trees' || projectPurpose === 'conservation') && //for restoration  &  conservationcontribution
            projectUnit === 'm2' &&
            t('profile:myContributions.areaType', {
              areaConserved: `${quantity}`,
              type: `${
                projectPurpose === 'trees'
                  ? t('profile:myContributions.restoredSmall')
                  : t('profile:myContributions.conservedSmall')
              } `,
            })}
          {/* {contributionType === 'planting' &&
            countryName &&
            tpoName && //for register  tree contribution
            t('profile:myContributions.treeRegistered', {
              count: Number(`${quantity?.toFixed(2)}`) || 0,
            })} */}
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
          {_checkConditions()}
        </div>
      )}
    </div>
  );
};

export default TreesOrUnitAreaAndDonateOption;
