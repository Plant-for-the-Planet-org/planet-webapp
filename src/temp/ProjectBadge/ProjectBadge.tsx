import React, { ReactElement, useMemo } from 'react';
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

interface TitleAndIconReturnType {
  icon: ReactElement;
  title: string;
}

const ProjectBadge = ({ isApproved, isTopProject, allowDonations }: Props) => {
  const { t } = useTranslation(['common', 'projectDetails']);

  const getTitleAndIcon = (
    isApproved: boolean,
    isTopProject: boolean,
    allowDonations: boolean
  ): TitleAndIconReturnType | undefined => {
    return useMemo(() => {
      if (!allowDonations) {
        return {
          icon: <NewInfoIcon width={10} height={10} color={'var(--light)'} />,
          title: t('common:notDonatable'),
        };
      }

      if (isTopProject && isApproved) {
        return {
          icon: <TopProjectIcon color={'var(--light)'} width={11} />,
          title: t('common:topProject'),
        };
      }

      if (isTopProject && !isApproved) {
        return {
          icon: <FieldReviewedIcon width={10} color={'var(--light)'} />,
          title: t('projectDetails:fieldReviewed'),
        };
      }
      if (!isTopProject && !isApproved) {
        return {
          icon: <OffSiteReviewedIcon width={10} color={'var(--light)'} />,
          title: t('projectDetails:offSiteReviewed'),
        };
      }
    }, [isApproved, isTopProject, allowDonations, t]);
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
