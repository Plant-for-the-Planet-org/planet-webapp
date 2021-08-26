import React, { ReactElement } from 'react';
import i18next from '../../../../../i18n';
import SelectLanguageAndCountry from './SelectLanguageAndCountry';
import styles from './AccountFooter.module.scss';

interface Props {}

const { useTranslation } = i18next;

export default function AccountFooter({}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['common']);
  const [footerLang, setFooterLang] = React.useState('en');
  const [language, setLanguage] = React.useState(i18n.language);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState('EUR');
  const [selectedCountry, setSelectedCountry] = React.useState('DE');

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let footerLang = localStorage.getItem('language') || 'en';
      footerLang = footerLang.toLowerCase(); // need lowercase locals for Wordpress website links
      setFooterLang(footerLang);
    }
  }, [language]);

  React.useEffect(() => {
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('currencyCode')) {
        const currencyCode = localStorage.getItem('currencyCode');
        if (currencyCode) setSelectedCurrency(currencyCode);
      }
      if (localStorage.getItem('countryCode')) {
        const countryCode = localStorage.getItem('countryCode');
        if (countryCode) setSelectedCountry(countryCode);
      }
      if (localStorage.getItem('language')) {
        const langCode = localStorage.getItem('language');
        if (langCode) setLanguage(langCode);
      }
    }
  }, []);
  return ready ? (
    <footer>
      <div className={styles.footerContainer}>
        <div
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <p className={styles.links}>{`🌐 ${
            language ? language.toUpperCase() : ''
          } • ${selectedCurrency}`}</p>
        </div>
        <SelectLanguageAndCountry
          openModal={openModal}
          handleModalClose={handleModalClose}
          language={language}
          setLanguage={setLanguage}
          setSelectedCurrency={setSelectedCurrency}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      </div>
    </footer>
  ) : (
    <></>
  );
}
