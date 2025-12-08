import { clsx } from 'clsx';
import styles from './../styles/AdditionalContent.module.scss';
import gridStyles from './../styles/Grid.module.scss';

export default function AdditionalInfo() {
  return (
    <section className={styles.additionalContentSection}>
      <div className={gridStyles.fluidContainer}>
        <div
          className={clsx(
            gridStyles.gridRow,
            gridStyles.justifyContentCenter,
            gridStyles.alignItemsCenter
          )}
        >
          <div
            className={clsx(
              gridStyles.col12,
              gridStyles.colLg4,
              gridStyles.colMd6
            )}
          >
            <img
              src="/tenants/salesforce/images/mangroves/madagascar-ambanja-mangrove-seedling_2018_credit_Louise Jasper.jpg"
              alt="Blue Ventures Photo - Madagascar - Ambanja mangrove seedling. Credit Louise Jasper 2018"
            ></img>
          </div>
          <div
            className={clsx(
              gridStyles.col12,
              gridStyles.colLg4,
              gridStyles.colMd6
            )}
          >
            <img
              src="/tenants/salesforce/images/mangroves/bahamas-mangroves.jpg"
              alt="PIMS Photo - Bahamas Mangroves"
            ></img>
          </div>
          <div
            className={clsx(
              gridStyles.col12,
              gridStyles.colLg4,
              gridStyles.colMd6
            )}
          >
            <img
              src="/tenants/salesforce/images/mangroves/tanzania.jpg"
              alt="SOA Photo - Tanzania Mangrove Planting"
            ></img>
          </div>
        </div>
      </div>
    </section>
  );
}
