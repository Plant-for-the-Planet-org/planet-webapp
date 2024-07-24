import React, { ReactElement, useMemo } from 'react';
import OffSiteReviewedIcon from '../icons/OffSiteReviewedIcon';
import FieldReviewedIcon from '../icons/FieldReviewedIcon';
import styles from './Badge.module.scss';
import TopProjectIcon from '../icons/TopProjectIcon';
import { useTranslations } from 'next-intl';
import CustomTooltip from '../../features/common/Layout/CustomTooltip';
import themeProperties from '../../theme/themeProperties';
import { useTenant } from '../../features/common/Layout/TenantContext';

interface Props {
  isApproved: boolean;
  isTopProject: boolean;
  allowDonations: boolean;
}

interface TitleAndIconReturnType {
  icon: ReactElement;
  title: string;
}

const ProjectBadge = ({ isApproved, isTopProject, allowDonations }: Props) => {
  const tCommon = useTranslations('Common');
  const tProjectDetails = useTranslations('ProjectDetails');
  const getTitleAndIcon = (
    isApproved: boolean,
    isTopProject: boolean,
    allowDonations: boolean
  ): TitleAndIconReturnType | undefined => {
    const { tenantConfig } = useTenant();
    return useMemo(() => {
      if (!allowDonations) {
        return {
          icon: (
            <CustomTooltip
              height={10}
              width={10}
              color={themeProperties.light.light}
            >
              <div className={styles.tooltipContent}>
                {tenantConfig.config.slug === 'salesforce'
                  ? `${tCommon('salesforceDisabledDonateButtonText')}`
                  : `${tCommon('disabledDonateButtonText')}`}
              </div>
            </CustomTooltip>
          ),
          title: tCommon('notDonatable'),
        };
      }

      if (isTopProject && isApproved) {
        return {
          icon: <TopProjectIcon color={'var(--light)'} width={11} />,
          title: tCommon('topProject'),
        };
      }

      if (!isTopProject && isApproved) {
        return {
          icon: <FieldReviewedIcon width={10} color={'var(--light)'} />,
          title: tProjectDetails('fieldReviewed'),
        };
      }
      if (!isTopProject && !isApproved) {
        return {
          icon: <OffSiteReviewedIcon width={10} color={'var(--light)'} />,
          title: tProjectDetails('offSiteReviewed'),
        };
      }
    }, [isApproved, isTopProject, allowDonations, tCommon, tProjectDetails]);
  };

  const { icon, title } =
    getTitleAndIcon(isApproved, isTopProject, allowDonations) || {};
  return (
    <div className={styles.projectBadge}>
      <div className={styles.badgeIcon}>{icon}</div>
      <div className={styles.badgeTitle}>{title}</div>
    </div>
  );
};

export default ProjectBadge;
