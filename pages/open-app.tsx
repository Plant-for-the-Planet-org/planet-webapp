import Footer from '../src/features/common/Layout/Footer';
import i18next from '../i18n';

const { useTranslation } = i18next;

export default function OpenApp() {

  const { t, ready } = useTranslation(['common']);

  const styles = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
    color: 'var(--primary-font-color)'
  }

  return ready ? (
    <>
      <div style={styles}>
        <h2 >{t('common:opening_native_app')}</h2>
      </div>
      <Footer/>
    </>
  ) : null;
}
