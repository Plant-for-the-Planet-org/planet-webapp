import SDGCardList from './SDGCardList';
import styles from './InfoAndCta.module.scss';
import PublicProfileActions from './PublicProfileActions';

const InfoAndCta = () => {
  return (
    <div className={styles.infoAndCtaContainer}>
      <PublicProfileActions />
      {/* treegame embedd */}
      <SDGCardList />
    </div>
  );
};

export default InfoAndCta;
