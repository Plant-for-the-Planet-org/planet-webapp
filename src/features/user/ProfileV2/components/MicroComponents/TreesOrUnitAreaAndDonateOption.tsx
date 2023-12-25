import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { getDonationUrl } from '../../../../../utils/getDonationUrl';
import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';

interface TreesOrUnitAreaAndDonateOptionProps {
  projectUnit: string;
  projectPurpose: string | null;
  quantity: number | null;
  contributionType: string | boolean;
  gift: boolean;
  tenantId: string;
  projectGUID: string;
  isDonatable: boolean;
}

const TreesOrUnitAreaAndDonateOption = ({
  projectUnit,
  projectPurpose,
  quantity,
  contributionType,
  gift,
  tenantId,
  projectGUID,
  isDonatable,
}: TreesOrUnitAreaAndDonateOptionProps) => {
  const { t } = useTranslation(['me']);
  const { embed } = useContext(ParamsContext);
  const { token } = useUserProps();
  const router = useRouter();
  const handleDonate = (id: string, tenant: string) => {
    const url = getDonationUrl(tenant, id, token);
    embed === 'true'
      ? window.open(url, '_blank')
      : (window.location.href = url);
  };
  return (
    <div className={myForestStyles.donateContainer}>
      <time className={myForestStyles.treeCount}>
        {projectUnit
          ? projectUnit === 'm2'
            ? t('me:areaType', {
                areaConserved: `${quantity}`,
                type: `${
                  projectPurpose === 'trees' ? 'restored' : 'conserved'
                } `,
              })
            : t('me:plantedTrees', {
                count: parseInt(`${quantity}`) || 0,
              })
          : t('me:plantedTrees', {
              count: parseInt(`${quantity}`) || 0,
            })}
      </time>
      {contributionType && contributionType !== 'planting' && isDonatable && (
        <div
          className={
            projectPurpose === 'conservation'
              ? myForestStyles.donateConserv
              : myForestStyles.donate
          }
          onClick={() => handleDonate(projectGUID, tenantId)}
        >
          {gift || router.pathname === '/t/[id]'
            ? t('me:donate')
            : t('me:donateAgain')}
        </div>
      )}
    </div>
  );
};

export default TreesOrUnitAreaAndDonateOption;