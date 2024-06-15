import { useTranslations } from 'next-intl';
import { LeaderboardItem } from '../../../common/types/myForestv2';
import styles from './communityContributions.module.scss';

const ContributionListItem = ({
  name,
  units,
  unitType,
  purpose,
}: LeaderboardItem) => {
  const t = useTranslations('Profile');

  const contributedUnits =
    unitType === 'tree'
      ? t('myContributions.treesContributed', {
          count: units,
        })
      : t('myContributions.areaContributed', {
          count: units,
          projectPurpose: purpose,
        });

  return (
    <li className={styles.contributionListItem}>
      <span>{name}</span>
      <span className={styles.units}>{contributedUnits}</span>
    </li>
  );
};

export default ContributionListItem;