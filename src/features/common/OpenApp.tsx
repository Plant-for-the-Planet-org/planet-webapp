import Footer from './Layout/Footer';
import i18next from '../../../i18n';

const { useTranslation } = i18next;

export default function OpenApp() {

  const { t } = useTranslation(['common']);

  const styles = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column'
  }

  return (
    <>
      <div style={styles}>
        <h2>{t('common:opening_native_app')}</h2>
      </div>
      <Footer/>
    </>
  );
}
