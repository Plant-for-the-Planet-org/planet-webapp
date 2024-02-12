import React from 'react';
import NewInfoIcon from '../icons/NewInfoIcon';
import OffSiteReviewedIcon from '../icons/OffSiteReviewedIcon';
import FieldReviewedIcon from '../icons/FieldReviewedIcon';
import styles from './Badge.module.scss';
import TopProjectIcon from '../icons/TopProjectIcon';
import { useTranslation } from 'next-i18next';

interface Props {
  isApproved: boolean;
  isTopProject: boolean;
  allowDonations: boolean;
}

const ProjectBadge = ({ isApproved, isTopProject, allowDonations }: Props) => {
  const { t } = useTranslation(['common', 'projectDetails']);
  const getTitleAndIcon = (
    isApproved: boolean,
    isTopProject: boolean,
    allowDonations: boolean
  ) => {
    if (!allowDonations)
      return {
        icon: <NewInfoIcon width={10} height={10} color={'#fff'} />,
        title: t('common:notDonatable'),
      };

    if (isTopProject && isApproved)
      return {
        icon: <TopProjectIcon color={'#fff'} height={10} width={10} />,
        title: t('common:topProject'),
      };
    else if (isTopProject && !isApproved)
      return {
        icon: <FieldReviewedIcon />,
        title: t('projectDetails:fieldReviewed'),
      };
    else if (!isTopProject && !isApproved)
      return {
        icon: <OffSiteReviewedIcon />,
        title: t('projectDetails:offSiteReviewed'),
      };
  };
  return (
    <div className={styles.topProjectBadge}>
      <div className={styles.badgeIcon}>
        {getTitleAndIcon(isApproved, isTopProject, allowDonations)?.icon}
      </div>
      <div className={styles.badgeTitle}>
        {getTitleAndIcon(isApproved, isTopProject, allowDonations)?.title}
      </div>
    </div>
  );
};

export default ProjectBadge;
