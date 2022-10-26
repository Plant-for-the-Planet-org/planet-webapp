import Footer from '../src/features/common/Layout/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function OpenApp() {
  const { t, ready } = useTranslation(['common']);

  const styles = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    color: 'var(--primary-font-color)',
  };

  return ready ? (
    <>
      <div style={styles}>
        <h2>{t('common:opening_native_app')}</h2>
      </div>
      <Footer />
    </>
  ) : null;
}

export async function getServerSideProps(locale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'bulkCodes',
        'common',
        'country',
        'donate',
        'donation',
        'editProfile',
        'leaderboard',
        'managePay',
        'manageProjects',
        'maps',
        'me',
        'planet',
        'planetcash',
        'redeem',
        'registerTree',
        'tenants',
        'treemapper',
      ])),
    },
  };
}
