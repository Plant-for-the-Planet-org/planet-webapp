import styles from './ResponsibilityStatement.module.scss';
import commonStyles from '../../common.module.scss';

const ResponsibilityStatement = () => {
  return (
    <section className={styles.responsibilityStatement}>
      <h2 className={`${commonStyles.heading2} ${styles.heading}`}>
        Responsibility Statement
      </h2>
      <p className={styles.content}>
        We recognise our scale and reach as a company and how we have the
        opportunity to play a big role in global restoration efforts and
        protecting biodiversity in our regions. Our biodiversity framework
        reflects our evolution and aligns with the Global Biodiversity Framework
        and Kumning-Montreal targets recognising the need for sustainable
        solutions to landscape restoration.
      </p>
      <p className={styles.content}>
        We have expanded our programs with the intention that through a broader,
        strategic approach, we can create meaningful and enduring environmental
        and social benefits. Restoring nature can’t be achieved by one company
        or campaign alone, so we have forged partnerships that strengthen our
        integrated approach to ecosystem recovery.
      </p>
    </section>
  );
};
export default ResponsibilityStatement;
