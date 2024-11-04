import type { QueryParamType } from '../../../common/Layout/QueryParamsContext';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import styles from '../styles/ProjectSnippet.module.scss';

interface TpoNameProps {
  projectTpoName: string;
  page: 'project-list' | 'project-details' | undefined;
  allowDonations: boolean;
  isTopProject: boolean;
  isApproved: boolean;
  tpoSlug: string;
  embed: QueryParamType;
}

const TpoName = ({
  projectTpoName,
  page,
  allowDonations,
  isTopProject,
  isApproved,
  tpoSlug,
  embed,
}: TpoNameProps) => {
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const tpoNameBackgroundClass = useMemo(() => {
    if (!allowDonations) return `${styles.noDonation}`;
    if (isTopProject && isApproved) return `${styles.tpoBackground}`;
    return '';
  }, [isTopProject, isApproved, allowDonations]);

  const handleClick = () => {
    const url = `/t/${tpoSlug}`;
    if (embed === 'true') {
      window.open(url, '_top');
    } else {
      router.push(url);
    }
  };
  const tpoNameContainerClasses = `${
    styles.projectTpoName
  } ${tpoNameBackgroundClass} ${
    page === 'project-details' ? styles.projectTpoNameSecondary : ''
  }`;
  return (
    <div className={tpoNameContainerClasses} onClick={handleClick}>
      {tCommon('by', { tpoName: projectTpoName })}
    </div>
  );
};

export default TpoName;
