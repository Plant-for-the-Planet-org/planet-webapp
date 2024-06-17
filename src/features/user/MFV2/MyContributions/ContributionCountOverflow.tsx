import { useTranslations } from 'next-intl';
import styles from './MyContributions.module.scss';

interface Props {
  contributionCount: number;
  displayedCount: number;
}

const ContributionCountOverflow = ({
  contributionCount,
  displayedCount,
}: Props) => {
  const t = useTranslations('Profile');

  if (contributionCount <= displayedCount) return null;

  return (
    <div className={styles.contributionCountOverflow}>
      {t('myContributions.contributionCountOverflow', {
        additionalCount: contributionCount - displayedCount,
      })}
    </div>
  );
};

export default ContributionCountOverflow;
