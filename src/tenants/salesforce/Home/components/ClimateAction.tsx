import { clsx } from 'clsx';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import styles from './../styles/ClimateAction.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import Link from 'next/link';

// const articles = [
//   {
//     id: 1,
//     category: 'trailhead',
//     title: 'Learn how trees combat climate change on Trailhead',
//     image: '/tenants/salesforce/images/climate-action-1.png',
//     link: 'https://trailhead.salesforce.com/content/learn/modules/trees-to-combat-climate-change',
//   },
//   {
//     id: 2,
//     category: 'sustainability cloud',
//     title:
//       'Make working-from-home more comfortable, productive, and sustainable',
//     image: '/tenants/salesforce/images/climate-action-2.png',
//     link: 'https://www.salesforce.com/blog/2020/09/sustainability-environmentally-friendly-work-from-home.html',
//   },
//   {
//     id: 3,
//     category: '360 blog',
//     title:
//       'Calculate your corporate emissions with Salesforce Sustainability Cloud',
//     image: '/tenants/salesforce/images/climate-action-3.png',
//     link: 'https://www.salesforce.com/products/sustainability-cloud/overview/',
//   },
// ];

export default function ClimateAction() {
  const { localizedPath } = useLocalizedPath();
  return (
    <section className={styles.climateActionSection}>
      <div className={gridStyles.fluidContainer}>
        {/* <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <h3>Branch out.</h3>
            <p>
              <small>Here are a few more ways to take action:</small>
            </p>
          </div>
        </div>
        <div className={gridStyles.gridRow}>
          {articles.map((article) => {
            return (
              <div
                key={`climate-action-${article.id}`}
                className={clsx(
                  gridStyles.col12,
                  gridStyles.colMd4,
                  styles.climateActionContent
                )}
              >
                <a
                  href={article.link}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <img src={article.image} alt="" />
                  <span>{article.category}</span>
                  <h4>{article.title}</h4>
                </a>
              </div>
            );
          })}
        </div> */}
        <div
          className={clsx(
            gridStyles.gridRow,
            gridStyles.justifyContentCenter,
            gridStyles.mb65100
          )}
        >
          <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
            <h3>Resources</h3>
            <ul className={styles.resourceList}>
              <li>
                Explore{' '}
                <a
                  href="https://www.salesforce.com/sustainability/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Sustainability at Salesforce
                </a>
              </li>
              <li>
                Learn more about the{' '}
                <a
                  href="https://www.1t.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  trillion trees movement
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className={clsx(
            gridStyles.gridRow,
            styles.climateActionDonate,
            gridStyles.justifyContentCenter
          )}
        >
          <div className={clsx(gridStyles.col8, gridStyles.colMd12)}>
            <h3>Becoming a tree champion is easy.</h3>
            <p>
              <small>
                Select your favorite tree project and lend your support.
              </small>
            </p>
            <Link
              href={localizedPath('/')}
              className={styles.donateForTreesButton}
            >
              Donate For Trees Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
