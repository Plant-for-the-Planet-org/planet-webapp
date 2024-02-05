import React from 'react';
import NewInfoIcon from '../icons/NewInfoIcon';
import OffSiteReviewedIcon from '../icons/OffSiteReviewedIcon';
import FieldReviewedIcon from '../icons/FieldReviewedIcon';
import styles from './Badge.module.scss';
import TopProjectIcon from '../icons/TopProjectIcon';

interface Props {
  isApproved: boolean;
  isTopProject: boolean;
  allowDonations: boolean;
}

const ProjectBadge = ({ isApproved, isTopProject, allowDonations }: Props) => {
  const getTitleAndIcon = (
    isApproved: boolean,
    isTopProject: boolean,
    allowDonations: boolean
  ) => {
    if (!allowDonations)
      return {
        icon: <NewInfoIcon width={10} height={10} color={'#fff'} />,
        title: 'Not Donatable',
      };

    if (isTopProject && isApproved)
      return {
        icon: <TopProjectIcon color={'#fff'} height={10} width={10} />,
        title: 'Top Project',
      };
    else if (isTopProject && !isApproved)
      return {
        icon: <FieldReviewedIcon />,
        title: 'Field Reviewed',
      };
    else if (!isTopProject && !isApproved)
      return {
        icon: <OffSiteReviewedIcon />,
        title: 'Off-Site reviewed',
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
