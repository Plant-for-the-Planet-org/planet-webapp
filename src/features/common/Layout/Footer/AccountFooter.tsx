import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import SelectLanguageAndCountry from './SelectLanguageAndCountry';
import styles from './AccountFooter.module.scss';

export default function AccountFooter(): ReactElement {
  const { i18n, ready } = useTranslation(['common']);
  const [language, setLanguage] = React.useState(i18n.language);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState('EUR');
  const [selectedCountry, setSelectedCountry] = React.useState('DE');

  const handleModalClose = () => {
    setOpenModal(false);
  };

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
