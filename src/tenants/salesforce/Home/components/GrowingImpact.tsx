import styles from './../styles/GrowingImpact.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import Timeline from './Timeline';
import Link from "next/link";

export default function GrowingImpact() {
  const articles = [
    {
      id: 1,
      copy: 'The Field Marketing Team donated 40,000 trees on behalf of STARs accounts for Earth Day.',
      subCopy: 'Rally your team today!',
      image: '/tenants/salesforce/images/growing-impact/success-1.jpg',
      foliage: '/tenants/salesforce/images/growing-impact/foliage-1.png',
      link: 'https://trailhead.salesforce.com/content/learn/modules/trees-to-combat-climate-change',
      bgColor: '#024D4C'
    },
    {
      id: 2,
      copy: 'The Global Onboarding Team team donates a tree for every hire.',
      subCopy: 'How do you benchmark goals?',
      image: '/tenants/salesforce/images/growing-impact/success-2.jpg',
      foliage: '/tenants/salesforce/images/growing-impact/foliage-2.png',
      link: 'https://www.salesforce.com/company/sustainability/',
      bgColor: '#396547'
    },
    {
      id: 3,
      copy: 'SEMEA Account teams committed to 1M trees by 2030.',
      subCopy: 'How can you work with clients and partners?',
      image: '/tenants/salesforce/images/growing-impact/success-3.jpg',
      foliage: '/tenants/salesforce/images/growing-impact/foliage-3.png',
      link: 'https://www.salesforce.com/products/sustainability-cloud/overview/',
      bgColor: '#0B827C'
    },
    {
      id: 4,
      copy: 'Accenture, our Dreamforce 2021 sustainability partner, donated $10,000 to help save trees!',
      image: '/tenants/salesforce/images/growing-impact/success-4.jpg',
      foliage: '/tenants/salesforce/images/growing-impact/foliage-4.png',
      link: 'https://www.salesforce.com/products/sustainability-cloud/overview/',
      bgColor: '#1C3326',
      partnerLogo: '/tenants/salesforce/images/partner-logo.png'
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
              <div key={`climate-action-${article.id}`} className={`${gridStyles.col12} ${gridStyles.colLg3} ${gridStyles.colMd6} ${styles.climateActionContent}`}>
                  <img src={article.partnerLogo} alt="" className={`${styles.partnerLogo}`} />
                  <div style={{backgroundImage: `url(${article.image})`}} className={`${styles.imageContainer}`}></div>
                  <div style={{backgroundColor: `${article.bgColor}`}} className={`${styles.contentContainer}`}>
                    <h5>{article.copy}</h5>
                    <h5>{article.subCopy}</h5>
                    <img src={article.foliage} alt="" className={`${styles.foliage}`} />
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
