import styles from './../styles/AdditionalContent.module.scss';
import gridStyles from './../styles/Grid.module.scss';

export default function AdditionalInfo() {
  return (
    <section className={styles.additionalContentSection}>
      <div className={gridStyles.fluidContainer}>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter}`}
        >
          <div
            className={`${gridStyles.col12} ${gridStyles.colLg4} ${gridStyles.colMd6}`}
          >
            <img src="/tenants/salesforce/images/oceanforce_2.png"></img>
          </div>
          <div
            className={`${gridStyles.col12} ${gridStyles.colLg4} ${gridStyles.colMd6}`}
          >
            <img src="/tenants/salesforce/images/oceanforce_1.png"></img>
          </div>
          <div
            className={`${gridStyles.col12} ${gridStyles.colLg4} ${gridStyles.colMd6}`}
          >
            <img src="/tenants/salesforce/images/oceanforce_3.png"></img>
          </div>
        </div>
      </div>
    </section>
  );
}
