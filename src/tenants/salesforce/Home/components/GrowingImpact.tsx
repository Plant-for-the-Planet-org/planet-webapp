import styles from './../styles/GrowingImpact.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import Timeline from './Timeline';

type BaseArticle = {
  id: number;
  copy: string;
  subCopy?: string;
  image: string;
  foliage: string;
  bgColor: string;
  partnerLogo?: string;
};

type SingleLinkArticle = BaseArticle & {
  link: string;
  linkCopy?: string;
};

type MultipleLinkArticle = BaseArticle & {
  links: {
    mainText: string;
    items: {
      linkText: string;
      link: string;
    }[];
  };
};

type Article = SingleLinkArticle | MultipleLinkArticle;

function isSingleLinkArticle(article: Article): article is SingleLinkArticle {
  return 'link' in article;
}
const articles: Article[] = [
  {
    id: 1,
    copy: 'The Field Marketing Team donated 40,000 trees on behalf of STARs accounts for Earth Day.',
    subCopy: 'Rally your team today!',
    image: '/tenants/salesforce/images/growing-impact/success-1.jpg',
    foliage: '/tenants/salesforce/images/growing-impact/foliage-1.png',
    link: 'https://trailhead.salesforce.com/content/learn/modules/trees-to-combat-climate-change',
    bgColor: styles.sfDsTeal30,
  },
  {
    id: 2,
    copy: 'The Global Onboarding Team team donates a tree for every hire.',
    subCopy: 'How do you benchmark goals?',
    image: '/tenants/salesforce/images/growing-impact/success-2.jpg',
    foliage: '/tenants/salesforce/images/growing-impact/foliage-2.png',
    link: 'https://www.salesforce.com/company/sustainability/',
    bgColor: styles.sfCustomGreen1,
  },
  {
    id: 3,
    copy: 'SEMEA Account teams kicked off the 1M trees initiative.',
    subCopy: 'How can you involve your clients and partners?',
    image: '/tenants/salesforce/images/growing-impact/success-3.jpg',
    foliage: '/tenants/salesforce/images/growing-impact/foliage-3.png',
    link: 'https://www.salesforce.com/products/sustainability-cloud/overview/',
    bgColor: styles.sfDsTeal50,
  },
  {
    id: 4,
    copy: 'Accenture, our Dreamforce 2021 sustainability partner, donated 5,000 trees!',
    image: '/tenants/salesforce/images/growing-impact/success-4.jpg',
    foliage: '/tenants/salesforce/images/growing-impact/foliage-4.png',
    link: 'https://www.salesforce.com/products/sustainability-cloud/overview/',
    bgColor: styles.sfCustomGreen2,
    partnerLogo: '/tenants/salesforce/images/partner-logo.png',
  },
  {
    id: 5,
    copy: 'Fitness-for-a-Cause Challenge: Over 62,500 trees were funded during the Earthforce Champion Month in April 2023 and 2024.',
    image: '/tenants/salesforce/images/growing-impact/success-3.jpg',
    foliage: '/tenants/salesforce/images/growing-impact/foliage-3.png',
    links: {
      mainText: 'Learn more about the cause',
      items: [
        {
          linkText: 'Challenge 2023',
          link: '/vto-fitness-challenge-2023',
        },
        {
          linkText: 'Challenge 2024',
          link: '/vto-fitness-challenge-2024',
        },
      ],
    },
    bgColor: styles.sfDsTeal50,
  },
  {
    id: 6,
    copy: '2023 Oceanforce Challenge: Over 3,000 Mangroves planted!',
    image: '/tenants/salesforce/images/bkgd-guatemala-2.png',
    foliage: '/tenants/salesforce/images/growing-impact/foliage-2.png',
    link: '/mangrove-challenge',
    linkCopy: 'Click here to learn more about the cause',
    bgColor: styles.sfCustomGreen1,
  },
];

export default function GrowingImpact() {
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
                  {article.subCopy !== undefined && <h5>{article.subCopy}</h5>}
                  {isSingleLinkArticle(article) &&
                    article.linkCopy !== undefined && (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {article.linkCopy}
                      </a>
                    )}
                  {!isSingleLinkArticle(article) && (
                    <div className={styles.references}>
                      {article.links.mainText}:
                      <ul>
                        {article.links.items.map((item, index) => (
                          <li key={index} className={styles.referenceItem}>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {item.linkText}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
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
