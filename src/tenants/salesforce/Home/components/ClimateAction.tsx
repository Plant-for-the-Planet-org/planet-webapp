import styles from './../styles/ClimateAction.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import Link from "next/link";

export default function ClimateAction() {
  const articles = [
    {
      id: 1,
      category: 'trailhead',
      title: 'Learn how trees combat climate change on Trailhead.',
      image: '/tenants/salesforce/images/climate-action-1.png',
      link: 'https://trailhead.salesforce.com/content/learn/modules/trees-to-combat-climate-change',
    },
    {
      id: 2,
      category: 'sustainability',
      title: 'Learn about Salesforce’s sustainability initiatives.',
      image: '/tenants/salesforce/images/climate-action-2.png',
      link: 'https://www.salesforce.com/company/sustainability/',
    },
    {
      id: 3,
      category: '360 blog',
      title: 'Embed sustainability into the core of your business with Salesforce Sustainability Cloud.',
      image: '/tenants/salesforce/images/climate-action-3.png',
      link: 'https://www.salesforce.com/products/sustainability-cloud/overview/',
    },
  ];

  return (
    <section className={styles.climateActionSection}>
      <div className={gridStyles.fluidContainer}>
        <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <h3>Take climate action.</h3>
            <p><small>The fun doesn’t stop here. If you’re inspired to do more, follow these paths:</small></p>
          </div>
        </div>
        <div className={gridStyles.gridRow}>
          {articles.map((article) => {
            return (
              <div key={`climate-action-${article.id}`} className={`${gridStyles.col12} ${gridStyles.colMd4} ${styles.climateActionContent}`}>
                <a href={article.link} target="_blank" rel="noreferrer">
                  <img src={article.image} alt="" />
                  <span>{article.category}</span>
                  <h4>{article.title}</h4>
                </a>
              </div>
            );
          })}
        </div>
        <div className={`${gridStyles.gridRow} ${styles.climateActionDonate} ${gridStyles.justifyContentCenter}`}>
          <div className={`${gridStyles.col8} ${gridStyles.colMd12}`}>
            <h3>Becoming a tree champion is easy.</h3>
            <p><small>Select your favorite tree project and lend your support.</small></p>
            <Link href="/">
              <button>Start Planting</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
