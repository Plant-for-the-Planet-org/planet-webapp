import { clsx } from 'clsx';
import styles from './../styles/AdditionalInfo.module.scss';
import gridStyles from './../styles/Grid.module.scss';

export default function AdditionalInfo() {
  return (
    <section className={styles.additionalInfoSection}>
      <div className={gridStyles.fluidContainer}>
        <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <h3>About the Cause</h3>
          </div>
        </div>
        <div
          className={clsx(gridStyles.gridRow, gridStyles.justifyContentCenter)}
        >
          <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
            <p>
              As a co-founder of 1t.org and proud supporter of the trillion
              trees movement, Salesforce committed to fund the conservation,
              restoration, and reforestation of 100 million trees by 2030. In
              our FY26 Corporate V2MOM, Salesforce will add another 8 million
              trees by year end. This challenge is in support of this initiative
              all while encouraging greater health and wellness among our
              amazing employees and providing a chance to log VTO by exercising
              for the cause. Our partner in this,{' '}
              <a
                href="https://www.plant-for-the-planet.org/"
                target="_blank"
                rel="noreferrer"
              >
                Plant-for-the-Planet
              </a>
              , connects our funding with tree planting projects all over the
              world. Together, we can help create a greener and cleaner future
              by moving toward 100 million trees.
            </p>
          </div>
        </div>
        <div
          className={clsx(gridStyles.gridRow, gridStyles.justifyContentCenter)}
        >
          <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
            <div className={styles.videoContainer}>
              <iframe
                src="https://customer-3h4q1m4a9rqr5i6y.cloudflarestream.com/d20fa8f183f67d5fbe9efb5b4aedb102/iframe?preload=true&poster=https%3A%2F%2Fcustomer-3h4q1m4a9rqr5i6y.cloudflarestream.com%2Fd20fa8f183f67d5fbe9efb5b4aedb102%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D0h1m5s%26height%3D600"
                className={styles.iframe}
                allow={
                  'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
                }
                allowFullScreen={true}
                title="Salesforce Tree Planting Initiative Video"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
        <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <h3>Fitness-for-a-Cause Challenges at Salesforce</h3>
          </div>
        </div>
        <div
          className={clsx(gridStyles.gridRow, gridStyles.justifyContentCenter)}
        >
          <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
            <p>
              The primary goal of Fitness-for-a-Cause is to raise funds for
              various charitable organizations while encouraging consistent
              physical activity, improved health and wellness, and providing a
              fun way to compete and connect with colleagues across the world.
              Since 2020,{' '}
              <strong>
                Salesforce employees have raised over $500,000 dollars through{' '}
                <span className={styles.noWrap}>Fitness-for-a-Cause</span>{' '}
                challenges
              </strong>
              .
            </p>
          </div>
        </div>
        <div
          className={clsx(
            gridStyles.gridRow,
            gridStyles.justifyContentCenter,
            gridStyles.alignItemsCenter,
            styles.logoContainer
          )}
        >
          <div
            className={clsx(
              gridStyles.colMd6,
              gridStyles.justifyContentCenter,
              gridStyles.alignItemsCenter,
              styles.logoContainer
            )}
          >
            +{' '}
            <img
              src="/tenants/salesforce/images/earthforce-pp.png"
              alt="Earthforce + Plant-for-the-Planet logo"
            />
          </div>
          <div
            className={clsx(
              gridStyles.colMd3,
              gridStyles.justifyContentCenter,
              gridStyles.alignItemsCenter
            )}
          >
            <img src="/tenants/salesforce/images/1t.png" alt="1t.org logo" />
          </div>
        </div>
      </div>
    </section>
  );
}
