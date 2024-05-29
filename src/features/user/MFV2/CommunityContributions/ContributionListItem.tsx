import { LeaderboardItem } from '../../../common/types/myForestv2';
import styles from './communityContributions.module.scss';

const ContributionListItem = ({
  name,
  units,
  unitType,
  purpose,
}: LeaderboardItem) => {
  return (
    <li>
      <span>{name}</span>
      <span className={styles.units}>
        {units} {unitType}
      </span>
    </li>
  );
};

export default ContributionListItem;
