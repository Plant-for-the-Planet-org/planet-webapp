import styles from './communityContributions.module.scss';

interface Props {
  name: string;
  units: number;
  unitType: string;
}
const ContributionListItem = ({ name, units, unitType }: Props) => {
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
