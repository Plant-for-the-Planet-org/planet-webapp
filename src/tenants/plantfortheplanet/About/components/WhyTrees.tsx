import Image from 'react-bootstrap/Image';
import styles from './../About.module.scss';
export default function WhyTrees() {
  return (
    <section className={styles.YucantanSection}>
      <Image fluid src={'/static/images/home/WhyTrees.jpg'} />
      <div className={styles.YucantanSectionText}>
        <p className={styles.YucantanSectionTextHeader}>Why Trees?</p>
        <p className={styles.YucantanSectionTextPara}>
          How many are there? How many can we plant? Trees are one of the most
          powerful tools in a fight against the climate crisis.
        </p>
        <div className={styles.YucantanSectionTextLinkContainer}>
          <p className={styles.YucantanSectionTextLink}>Learn More</p>
        </div>
      </div>
    </section>
  );
}
