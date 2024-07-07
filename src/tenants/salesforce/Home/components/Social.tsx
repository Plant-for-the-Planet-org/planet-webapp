import styles from './../styles/Social.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import { useTenant } from '../../../../features/common/Layout/TenantContext';

export default function Social() {
  const { tenantConfig } = useTenant();

  const url = encodeURI(
    tenantConfig.config.slug.indexOf('http://') == 0 ||
      tenantConfig.config.slug.indexOf('https://') == 0
      ? tenantConfig.config.slug + '/home'
      : 'https://' + tenantConfig.config.slug + '/home'
  );
  const title = encodeURI(tenantConfig.config.meta.title);
  const handle = tenantConfig.config.meta.twitterHandle;
  const fbLink = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
  const liLink =
    'https://www.linkedin.com/shareArticle?url=' + url + '&title=' + title;
  const twLink =
    'https://twitter.com/intent/tweet?url=' +
    url +
    '&text=' +
    title +
    (handle ? '&via=' + handle.replace('@', '') : '');

  return (
    <section className={styles.socialSection}>
      <div className={gridStyles.fluidContainer}>
        <div className={gridStyles.gridRow}>
          <div className={gridStyles.col12}>
            <div className={styles.socialContent}>
              <img src="/tenants/salesforce/images/astro-social.png" alt="" />
              <a
                href={fbLink}
                className={styles.socialFacebook}
                target="_blank"
                rel="nofollow noreferrer"
              >
                <img src="/tenants/salesforce/images/facebook.png" alt="" />
              </a>
              <a
                href={liLink}
                className={styles.socialLinkedin}
                target="_blank"
                rel="nofollow noreferrer"
              >
                <img src="/tenants/salesforce/images/linkedin.png" alt="" />
              </a>
              <a
                href={twLink}
                className={styles.socialTwitter}
                target="_blank"
                rel="nofollow noreferrer"
              >
                <img src="/tenants/salesforce/images/twitter.png" alt="" />
              </a>
            </div>
            <h3>Invite a friend to join the trillion tree movement.</h3>
            <p>
              <small>Click on a social icon above to share.</small>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
