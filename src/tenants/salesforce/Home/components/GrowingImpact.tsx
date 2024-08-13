import styles from './../styles/GrowingImpact.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import Timeline from './Timeline';

export default function GrowingImpact() {
  const articles = [
    {
      id: 1,
      copy: 'The Field Marketing Team donated 40,000 trees on behalf of STARs accounts for Earth Day.',
      subCopy: 'Rally your team today!',
      image: '/tenants/salesforce/images/growing-impact/success-1.jpg',
      foliage: '/tenants/salesforce/images/growing-impact/foliage-1.png',
      link: 'https://trailhead.salesforce.com/content/learn/modules/trees-to-combat-climate-change',
      bgColor: '#024D4C',
    },
    {
      id: 2,
      copy: 'The Global Onboarding Team team donates a tree for every hire.',
      subCopy: 'How do you benchmark goals?',
      image: '/tenants/salesforce/images/growing-impact/success-2.jpg',
      foliage: '/tenants/salesforce/images/growing-impact/foliage-2.png',
      link: 'https://www.salesforce.com/company/sustainability/',
      bgColor: '#396547',
    },
    {
      id: 3,
      copy: 'SEMEA Account teams kicked off the 1M trees initiative.',
      subCopy: 'How can you involve your clients and partners?',
      image: '/tenants/salesforce/images/growing-impact/success-3.jpg',
      foliage: '/tenants/salesforce/images/growing-impact/foliage-3.png',
      link: 'https://www.salesforce.com/products/sustainability-cloud/overview/',
      bgColor: '#0B827C',
    },
    {
      id: 4,
      copy: 'Accenture, our Dreamforce 2021 sustainability partner, donated 5,000 trees!',
      image: '/tenants/salesforce/images/growing-impact/success-4.jpg',
      foliage: '/tenants/salesforce/images/growing-impact/foliage-4.png',
      link: 'https://www.salesforce.com/products/sustainability-cloud/overview/',
      bgColor: '#1C3326',
      partnerLogo: '/tenants/salesforce/images/partner-logo.png',
    },
    {
      id: 5,
      copy: '2023 Fitness-for-a-Cause Challenge: Over 23,000 trees planted during Earthforce Champion month!',
      image: '/tenants/salesforce/images/growing-impact/success-3.jpg',
      foliage: '/tenants/salesforce/images/growing-impact/foliage-3.png',
      link: '/vto-fitness-challenge-2023',
      linkCopy: 'Click here to learn more about the cause',
      bgColor: '#0B827C',
    },
    {
      id: 6,
      copy: '2023 Oceanforce Challenge: Over 3,000 Mangroves planted!',
      image: '/tenants/salesforce/images/bkgd-guatemala-2.png',
      foliage: '/tenants/salesforce/images/growing-impact/foliage-2.png',
      link: '/mangrove-challenge',
      linkCopy: 'Click here to learn more about the cause',
      bgColor: '#396547',
    },
  ];

  return (
    <section className={styles.growingImpactSection}>
      <div className={gridStyles.fluidContainer}>
        <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <h3>Together, we are powerful.</h3>
          </div>
        </div>
        <div className={gridStyles.gridRow}>
          {articles.map((article) => {
            return (
              <div
                key={`climate-action-${article.id}`}
                className={`${gridStyles.col12} ${gridStyles.colLg3} ${gridStyles.colMd6} ${styles.climateActionContent}`}
              >
                <img
                  src={article.partnerLogo}
                  alt=""
                  className={`${styles.partnerLogo}`}
                />
                <div
                  style={{ backgroundImage: `url(${article.image})` }}
                  className={`${styles.imageContainer}`}
                ></div>
                <div
                  style={{ backgroundColor: `${article.bgColor}` }}
                  className={`${styles.contentContainer}`}
                >
                  <h5>{article.copy}</h5>
                  <h5>{article.subCopy}</h5>
                  {article.linkCopy !== undefined && (
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {article.linkCopy}
                    </a>
                  )}
                  <img
                    src={article.foliage}
                    alt=""
                    className={`${styles.foliage}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Timeline />
    </section>
  );
}
