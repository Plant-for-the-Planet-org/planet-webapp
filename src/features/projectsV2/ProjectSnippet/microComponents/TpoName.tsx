import type { BooleanQueryParam } from '../../../../stores/queryParamStore';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import styles from '../styles/ProjectSnippet.module.scss';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useCurrentPage } from '../../../../hooks/useCurrentPage';
import { clsx } from 'clsx';

interface TpoNameProps {
  projectTpoName: string;
  allowDonations: boolean;
  isTopProject: boolean;
  isApproved: boolean;
  tpoSlug: string;
  embed: BooleanQueryParam;
}

const TpoName = ({
  projectTpoName,
  allowDonations,
  isTopProject,
  isApproved,
  tpoSlug,
  embed,
}: TpoNameProps) => {
  const tCommon = useTranslations('Common');
  const { localizedPath } = useLocalizedPath();
  const currentPage = useCurrentPage();

  const tpoNameBackgroundClass = useMemo(() => {
    if (!allowDonations) return `${styles.noDonation}`;
    if (isTopProject && isApproved) return `${styles.tpoBackground}`;
    return '';
  }, [isTopProject, isApproved, allowDonations]);

  const url = `/t/${tpoSlug}`;
  const isEmbed = embed === 'true';
  const tpoNameContainerClasses = clsx(
    styles.projectTpoName,
    tpoNameBackgroundClass,
    { [styles.projectTpoNameSecondary]: currentPage === 'project-details' }
  );
  return (
    // Embedded widgets navigate the top browsing context to the non-localized
    // URL (previously window.open(url, '_top')); otherwise a normal localized
    // client-side navigation (previously router.push).
    <Link
      href={isEmbed ? url : localizedPath(url)}
      target={isEmbed ? '_top' : undefined}
      className={tpoNameContainerClasses}
    >
      {tCommon('by', { tpoName: projectTpoName })}
    </Link>
  );
};

export default TpoName;
