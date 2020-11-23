import styles from './../styles/Blogs.module.scss';
import gridStyles from './../styles/Grid.module.scss';

export default function Blogs() {
  const blogs = [
    {
      id: 1,
      name:
        'Become a tree champion on Trailhead and unlock a donation to Plant-for-the-Planet',
      imagePath: '/tenants/salesforce/images/Blog/1.png',
      link:
        'https://trailhead.salesforce.com/content/learn/modules/trees-to-combat-climate-change',
      linkTitle: 'Hit the Trail',
    },
    {
      id: 2,
      name:
        'Make working-from-home more comfortable, productive, and sustainable',
      imagePath: '/tenants/salesforce/images/Blog/2.png',
      link: 'https://www.salesforce.com/blog/2020/09/sustainability-environmentally-friendly-work-from-home.html',
      linkTitle: 'Read the Guide',
    },
    {
      id: 3,
      name:
        'Calculate your corporate emissions with Salesforce Sustainability Cloud',
      imagePath: '/tenants/salesforce/images/Blog/3.png',
      link:
        'https://www.salesforce.com/products/sustainability-cloud/overview/',
      linkTitle: 'Learn More',
    },
  ];

  return (
    <section className={styles.blogSection}>
      <p className={styles.blogSectionHeader}>Take climate action.</p>
      <div className={`${gridStyles.gridRow} ${styles.blogContainer}`}>
        {blogs.map((blog) => {
          return (
            <div key={blog.id} className={`${gridStyles.colSm10} ${gridStyles.colLg4}`}>
              <div className={styles.blogSingleContainer}>
                <img
                  className={styles.blogImage}
                  src={blog.imagePath}
                  alt={'Image of ' + blog.name}
                />
                <div className={styles.blogImageOverlay}></div>
                <div className={styles.blogInfoSection}>
                  {/* <p className={styles.blogtreeCount}>{blog.treeCount}</p> */}
                  <h3 className={styles.blogTitle}>{blog.name}</h3>
                  <a href={blog.link} target="_blank" rel="noopener noreferrer">
                    <p className={styles.blogLink}>{blog.linkTitle}</p>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
