import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../styles/ProjectSnippet.module.scss';
import { useRouter } from 'next/router';
import { QueryParamType } from '../../../common/Layout/QueryParamsContext';

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
  return (
    <div
      className={`${styles.projectTpoName} ${tpoNameBackgroundClass} ${
        page === 'project-list' ? styles.projectTpoNameSecondary : ''
      }`}
      onClick={handleClick}
    >
      {tCommon('by', { tpoName: projectTpoName })}
    </div>
  );
};

export default TpoName;
