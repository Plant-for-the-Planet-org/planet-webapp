import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';

export default function ContentSection() {
  return (
    <div className={`${styles.contentSectionContainer}`}>
      <div className={`${gridStyles.fluidContainer} ${styles.contentSection}`}>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <h2>Protecting Mangrove Forests</h2>
            <p className={styles.contentSectionSubhead}>
              Mangroves are critically important for climate, nature, and
              people, and Salesforce has placed a strategic priority on
              mangroves this year.
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12}`}
          >
            <img
              src="/tenants/salesforce/images/oceanforce_1.png"
              className={gridStyles.illustration}
              alt=""
            />
          </div>
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
          >
            <p>
              Mangrove forests are the ultimate climate champion and a bedrock
              for biodiversity: they provide food, shelter, and livelihoods;
              support biodiversity; build coastal resilience; and are among the
              world&apos;s most productive carbon sinks. Put simply, mangroves
              are critically important for climate, nature, and people,
              including many of the world&apos;s most vulnerable communities,
              which is why Salesforce has placed a strategic priority on
              mangroves this year.
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <p className={`${styles.contentSectionQuote}`}>
              <em>
                “Mangroves are unparalleled in their role as a powerful climate
                solution, a bedrock of biodiversity, and a source of livelihood
                for millions of people around the world”{' '}
              </em>{' '}
              - Suzanne DiBianca, EVP and Chief Impact Officer at Salesforce
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
