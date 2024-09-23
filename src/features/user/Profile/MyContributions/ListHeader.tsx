import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Profile.myContributions');

  return (
    <div className={styles.listHeader}>
      <h2 className={styles.headerTitle}>
        {props.profilePageType === 'private'
          ? t('titlePrivate')
          : t('titlePublic', { name: props.displayName })}
      </h2>
      <div className={styles.iconContainer}>
        <MyContributionsIcon />
      </div>
    </div>
  );
};

export default ListHeader;
