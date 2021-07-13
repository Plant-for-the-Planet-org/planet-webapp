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
  const FooterLinks = [
    {
      key: 'privacy',
      title: ready ? t('common:privacyAndTerms') : '',
      link: `https://a.plant-for-the-planet.org/${footerLang}/privacy-terms`,
    },
    {
      key: 'imprint',
      title: ready ? t('common:imprint') : '',
      link: `https://a.plant-for-the-planet.org/${footerLang}/imprint`,
    },
    {
      key: 'contact',
      title: ready ? t('common:contact') : '',
      link: 'mailto:support@plant-for-the-planet.org',
    },
    {
      key: 'faqs',
      title: ready ? t('common:faqs') : '',
      link: `https://a.plant-for-the-planet.org/${footerLang}/faq`,
    },
  ];

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
        {process.env.TENANT === 'ttc' || process.env.TENANT === 'planet' ? (
          <a
            rel="noopener noreferrer"
            href={`https://www.thegoodshop.org/de/shop/`}
            target={'_blank'}
          >
            <p className={styles.links}>{t('common:shop')}</p>
          </a>
        ) : null}
        {FooterLinks.map((item: any) => {
          return (
            <a
              key={item.key}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className={styles.links}>{item.title}</p>
            </a>
          );
        })}
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
