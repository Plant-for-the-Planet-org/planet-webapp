import React, { ReactElement, useMemo, JSX, useCallback } from 'react';
import OffSiteReviewedIcon from '../../../../../public/assets/images/icons/projectV2/OffSiteReviewedIcon';
import FieldReviewedIcon from '../../../../../public/assets/images/icons/projectV2/FieldReviewedIcon';
import TopProjectIcon from '../../../../../public/assets/images/icons/projectV2/TopProjectIcon';
import NewInfoIcon from '../../../../../public/assets/images/icons/projectV2/NewInfoIcon';
import styles from '../styles/Badge.module.scss';
import { useTranslations } from 'next-intl';
import CustomTooltip from '../../../common/Layout/CustomTooltip';
import { useTenant } from '../../../common/Layout/TenantContext';

interface Props {
  isApproved: boolean;
  isTopProject: boolean;
  allowDonations: boolean;
  showPopup: boolean;
}
interface TitleAndIconReturnType {
  icon: ReactElement;
  title: string;
  displayPopup: boolean;
  badgeType:
    | 'notDonatable'
    | 'topProject'
    | 'fieldReviewed'
    | 'offSiteReviewed';
}
interface BadgeLabelprops {
  icon: JSX.Element;
  title: string;
}
const BadgeLabel = ({ icon, title }: BadgeLabelprops) => {
  return (
    <div className={styles.projectBadge}>
      <div className={styles.badgeIcon}>{icon}</div>
      <div className={styles.badgeTitle}>{title}</div>
    </div>
  );
};

const ProjectBadge = ({
  isApproved,
  isTopProject,
  allowDonations,
  showPopup,
}: Props) => {
  const tCommon = useTranslations('Common');
  const tProjectDetails = useTranslations('ProjectDetails');
  const { tenantConfig } = useTenant();

  const badgeConfigurations: TitleAndIconReturnType | undefined =
    useMemo(() => {
      const badgeOptions: Record<string, TitleAndIconReturnType> = {
        notDonatable: {
          icon: <NewInfoIcon width={10} />,
          title: tCommon('notDonatable'),
          displayPopup: true,
          badgeType: 'notDonatable',
        },
        topProject: {
          icon: <TopProjectIcon width={11} />,
          title: tCommon('topProject'),
          displayPopup: true,
          badgeType: 'topProject',
        },
        fieldReviewed: {
          icon: <FieldReviewedIcon width={10} />,
          title: tProjectDetails('fieldReviewed'),
          displayPopup: false,
          badgeType: 'fieldReviewed',
        },
        offSiteReviewed: {
          icon: <OffSiteReviewedIcon width={10} />,
          title: tProjectDetails('offSiteReviewed'),
          displayPopup: false,
          badgeType: 'offSiteReviewed',
        },
      };
      const { notDonatable, topProject, fieldReviewed, offSiteReviewed } =
        badgeOptions;
      if (!allowDonations) return notDonatable;
      if (isTopProject && isApproved) return topProject;
      if (!isTopProject && isApproved) return fieldReviewed;
      if (!isTopProject && !isApproved) return offSiteReviewed;
    }, [isApproved, isTopProject, allowDonations, tCommon, tProjectDetails]);

  const renderMessage = (badgeType: string | undefined) => {
    if (badgeType === 'notDonatable') {
      return (
        <div className={styles.tooltipContent}>
          {tenantConfig.config.slug === 'salesforce'
            ? `${tCommon('salesforceDisabledDonateButtonText')}`
            : `${tCommon('disabledDonateButtonText')}`}
        </div>
      );
    } else if (badgeType === 'topProject') {
      return (
        <div className={styles.tooltipContent}>
          {tCommon.rich('top_project_standards_fulfilled', {
            standardsLink: (chunks) => (
              <a
                target="_blank"
                href={tCommon('standardsLink')}
                rel="noreferrer"
                className={styles.standardsLink}
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

  if (!badgeConfigurations) return null;

  const { icon, title, displayPopup, badgeType } = badgeConfigurations;

  const shouldShowPopup = useCallback(
    () => showPopup && displayPopup,
    [showPopup, displayPopup]
  );
  const badgeContent = <BadgeLabel icon={icon} title={title} />;

  return displayPopup ? (
    <CustomTooltip triggerElement={badgeContent} showPopup={shouldShowPopup()}>
      {renderMessage(badgeType)}
    </CustomTooltip>
  ) : (
    badgeContent
  );
};

export default ProjectBadge;
