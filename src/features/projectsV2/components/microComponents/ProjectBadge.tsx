import React, { ReactElement, useMemo } from 'react';
import OffSiteReviewedIcon from '../../../../../public/assets/images/icons/projectV2/OffSiteReviewedIcon';
import FieldReviewedIcon from '../../../../../public/assets/images/icons/projectV2/FieldReviewedIcon';
import TopProjectIcon from '../../../../../public/assets/images/icons/projectV2/TopProjectIcon';
import NewInfoIcon from '../../../../../public/assets/images/icons/projectV2/NewInfoIcon';
import style from '../../styles/Badge.module.scss';
import { useTranslations } from 'next-intl';
import CustomTooltip from '../../../common/Layout/CustomTooltip';
import { useTenant } from '../../../common/Layout/TenantContext';

interface Props {
  isApproved: boolean;
  isTopProject: boolean;
  allowDonations: boolean;
}

interface TitleAndIconReturnType {
  icon: ReactElement;
  title: string;
  displayPopup: boolean;
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
        displayPopup: true,
      },
      topProject: {
        icon: <TopProjectIcon width={11} />,
        title: tCommon('topProject'),
        displayPopup: true,
      },
      fieldReviewed: {
        icon: <FieldReviewedIcon width={10} />,
        title: tProjectDetails('fieldReviewed'),
        displayPopup: false,
      },
      offSiteReviewed: {
        icon: <OffSiteReviewedIcon width={10} />,
        title: tProjectDetails('offSiteReviewed'),
        displayPopup: false,
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
        <div className={style.tooltipContent}>
          {tenantConfig.config.slug === 'salesforce'
            ? `${tCommon('salesforceDisabledDonateButtonText')}`
            : `${tCommon('disabledDonateButtonText')}`}
        </div>
      );
    } else if (title === tCommon('topProject')) {
      return (
        <div className={style.tooltipContent}>
          {tCommon.rich('top_project_standards_fulfilled', {
            standardsLink: (chunks) => (
              <a
                target="_blank"
                href={tCommon('standardsLink')}
                rel="noreferrer"
                className={style.standardsLink}
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
  const { icon, title, displayPopup } = badgeConfig || {};
  return (
    <CustomTooltip
      badgeContent={
        <div className={style.projectBadge}>
          <div className={style.badgeIcon}>{icon}</div>
          <div className={style.badgeTitle}>{title}</div>
        </div>
      }
      shouldDisplayPopup={displayPopup}
    >
      {getMessage(title)}
    </CustomTooltip>
  );
};

export default ProjectBadge;
