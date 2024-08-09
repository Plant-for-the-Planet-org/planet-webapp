import React, { ReactElement, useMemo } from 'react';
import NewInfoIcon from '../icons/NewInfoIcon';
import OffSiteReviewedIcon from '../icons/OffSiteReviewedIcon';
import FieldReviewedIcon from '../icons/FieldReviewedIcon';
import styles from './Badge.module.scss';
import TopProjectIcon from '../icons/TopProjectIcon';
import { useTranslations } from 'next-intl';

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
    return useMemo(() => {
      if (!allowDonations) {
        return {
          icon: <NewInfoIcon width={10} height={10} color={'var(--light)'} />,
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
