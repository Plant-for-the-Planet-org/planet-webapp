import MyContributionsIcon from '../../../../../public/assets/images/icons/MyContributionsIcon';
import styles from './MyContributions.module.scss';

type PrivateProfileProps = {
  profilePageType: 'private';
};

type PublicProfileProps = {
  profilePageType: 'public';
  displayName: string;
};

type Props = PrivateProfileProps | PublicProfileProps;

const ListHeader = (props: Props) => {
  return (
    <div className={styles.listHeader}>
      <h2 className={styles.headerTitle}>
        {props.profilePageType === 'private'
          ? 'My Contributions'
          : `${props.displayName}'s Contributions`}
      </h2>
      <div className={styles.iconContainer}>
        <MyContributionsIcon />
      </div>
    </div>
  );
};

export default ListHeader;
