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
  const assignItemPurpose = (purpose: string) => {
    if (purpose === 'conservation')
      return t('communityContributions.conservationPurpose');
    if (purpose === 'trees' && unitType === 'm2')
      return t('communityContributions.restorationPurpose');
    return t('communityContributions.treesPurpose');
  };
  return (
    <li>
      <span>{name}</span>
      <span className={styles.units}>
        {units} {unitType === 'm2' && t('unitType.m2')}{' '}
        {assignItemPurpose(purpose)}
      </span>
    </li>
  );
};

export default ContributionListItem;
