import React, { ReactElement, useMemo } from 'react';
import OffSiteReviewedIcon from '../icons/OffSiteReviewedIcon';
import FieldReviewedIcon from '../icons/FieldReviewedIcon';
import styles from './Badge.module.scss';
import TopProjectIcon from '../icons/TopProjectIcon';
import { useTranslations } from 'next-intl';
import CustomTooltip from '../../features/common/Layout/CustomTooltip';
import themeProperties from '../../theme/themeProperties';
import { useTenant } from '../../features/common/Layout/TenantContext';
import NewInfoIcon from '../icons/NewInfoIcon';

interface Props {
  isApproved: boolean;
  isTopProject: boolean;
  allowDonations: boolean;
}

interface TitleAndIconReturnType {
  icon: ReactElement;
  title: string;
  displayTooltip: boolean;
}

const ProjectBadge = ({ isApproved, isTopProject, allowDonations }: Props) => {
  const tCommon = useTranslations('Common');
  const tProjectDetails = useTranslations('ProjectDetails');
  const { tenantConfig } = useTenant();

  const badgeConfig: TitleAndIconReturnType | undefined = useMemo(() => {
    const projectBadge = {
      notDonatable: {
        icon: <NewInfoIcon width={10} />,
        title: tCommon('notDonatable'),
        displayTooltip: true,
      },
      topProject: {
        icon: <TopProjectIcon width={11} />,
        title: tCommon('topProject'),
        displayTooltip: true,
      },
      fieldReviewed: {
        icon: <FieldReviewedIcon width={10} />,
        title: tProjectDetails('fieldReviewed'),
        displayTooltip: false,
      },
      offSiteReviewed: {
        icon: <OffSiteReviewedIcon width={10} />,
        title: tProjectDetails('offSiteReviewed'),
        displayTooltip: false,
      },
    };
    const { notDonatable, topProject, fieldReviewed, offSiteReviewed } =
      projectBadge;
    if (!allowDonations) return notDonatable;
    if (isTopProject && isApproved) return topProject;
    if (!isTopProject && isApproved) return fieldReviewed;
    if (!isTopProject && !isApproved) return offSiteReviewed;
  }, [isApproved, isTopProject, allowDonations, tCommon, tProjectDetails]);

  const getMessage = (title: string | undefined) => {
    if (title === tCommon('notDonatable')) {
      return (
        <div className={styles.tooltipContent}>
          {tenantConfig.config.slug === 'salesforce'
            ? `${tCommon('salesforceDisabledDonateButtonText')}`
            : `${tCommon('disabledDonateButtonText')}`}
        </div>
      );
    } else if (title === tCommon('topProject')) {
      return (
        <div className="topProjectPopupContainer">
          {tCommon.rich('top_project_standards_fulfilled', {
            standardsLink: (chunks) => (
              <a
                target="_blank"
                href={tCommon('standardsLink')}
                rel="noreferrer"
                style={{
                  color: themeProperties.primaryColor,
                  fontWeight: 400,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {chunks}
              </a>
            ),
          })}
        </div>
      );
    }
    return null;
  };
  const { icon, title, displayTooltip } = badgeConfig || {};
  return (
    <CustomTooltip
      badgeContent={
        <div className={styles.projectBadge}>
          <div className={styles.badgeIcon}>{icon}</div>
          <div className={styles.badgeTitle}>{title}</div>
        </div>
      }
      shouldDisplayTooltip={displayTooltip}
    >
      {getMessage(title)}
    </CustomTooltip>
  );
};

export default ProjectBadge;
