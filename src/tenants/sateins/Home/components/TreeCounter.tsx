import TreeCounter from '../../TreeCounter/TreeCounter';
import styles from './../styles/TreeCounter.module.scss';
interface Props {
  tenantScore: any;
}
export default function TreeCounterSection(tenantScore: Props) {
  const tenantScoreData = tenantScore.tenantScore
    ? tenantScore.tenantScore.total
    : '';
  return (
    <div className={`${styles.treeCounterSection}`}>
      <div className={styles.treeCounter}>
        <TreeCounter target={100000000} planted={tenantScoreData} />
      </div>
    </div>
  );
}
