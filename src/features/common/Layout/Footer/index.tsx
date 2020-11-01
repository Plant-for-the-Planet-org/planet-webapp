import React, { useEffect, useState } from 'react';
import AppleIcon from '../../../../../public/assets/images/footer/AppStore';
import GooglePlayIcon from '../../../../../public/assets/images/footer/GooglePlay';
import UNEPLogo from '../../../../../public/assets/images/footer/UNEPLogo';
import World from '../../../../../public/assets/images/footer/World';
import getLanguageName from '../../../../utils/language/getLanguageName';
import styles from './Footer.module.scss';
import SelectLanguageAndCountry from './SelectLanguageAndCountry';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

// let styles = require('./Footer.module.css');
export default function Footer() {
  const { t, i18n } = useTranslation(['common']);

  const [openModal, setOpenModal] = useState(false);
  const [language, setLanguage] = useState(i18n.language);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [selectedCountry, setSelectedCountry] = useState('US');

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const FooterLinks = [
    {
      id: 1,
      title: t('common:privacyAndTerms'),
      link: 'https://www.plant-for-the-planet.org/en/footermenu/privacy-policy',
    },
    {
      id: 2,
      title: t('common:imprint'),
      link: 'https://www.plant-for-the-planet.org/en/footermenu/imprint',
    },
    {
      id: 3,
      title: t('common:contact'),
      link: 'https://www.plant-for-the-planet.org/en/footermenu/form',
    },
    {
      id: 6,
      title: t('common:supportUs'),
      link: 'https://www.plant-for-the-planet.org/en/donation',
    },
  ];

  // changes the language and selected currency id found in local storage
  useEffect(() => {
    let langCode;
    let currencyCode;
    let countryCode;

    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('currencyCode')) {
        currencyCode = localStorage.getItem('currencyCode');
        if (currencyCode) setSelectedCurrency(currencyCode);
      }
      if (localStorage.getItem('countryCode')) {
        countryCode = localStorage.getItem('countryCode');
        if (countryCode) setSelectedCountry(countryCode);
      }
      if (localStorage.getItem('language')) {
        langCode = localStorage.getItem('language');
        if (langCode) setLanguage(langCode);
      }
    }
  }, []);

  return (
    <footer>
      <div className={styles.footerMainContainer}>
        <div className={styles.hr} />

        <div className={styles.footer_container}>
          <div>
            <div className={styles.footer_button_container}>
              <div onClick={handleModalOpen} className={styles.footer_button}>
                <World color={styles.primaryFontColor} />
                <p className={styles.selected_language}>
                  {`${getLanguageName(language)} · ${selectedCurrency}`}
                </p>
              </div>
              <a href="https://play.google.com/store/apps/details?id=org.pftp">
                <div className={styles.footer_button}>
                  <GooglePlayIcon />
                  <p className={styles.selected_language_bold}>Google Play</p>
                </div>
              </a>
              <a href="https://apps.apple.com/us/app/plant-for-the-planet/id1444740626">
                <div className={styles.footer_button}>
                  <AppleIcon />
                  <p className={styles.selected_language_bold}>App Store</p>
                </div>
              </a>
            </div>
            <div className={styles.footer_links_container}>
              {/* <p className={styles.footer_links}>© 2020 Plant-for-the-Planet</p> */}
              {FooterLinks.map((link) => {
                return (
                  <a key={link.title} href={link.link} target="_blank">
                    <p className={styles.footer_links}>{link.title}</p>
                  </a>
                );
              })}
            </div>
          </div>
          <div className={styles.logo_container}>
            <div className={styles.pfp_logo}>
              <a href="http://www.plant-for-the-planet.org/" target="_blank">
                <img
                  src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                  alt={t('common:about_pftp')}
                />
              </a>
            </div>
            {process.env.TENANT === 'planet' ||
              (!process.env.TENANT && (
                <div className={styles.unep_logo_container}>
                  <div>
                    <p className={styles.unep_logo_text}>Supports the UNEP</p>
                    <UNEPLogo />
                  </div>
                </div>
              ))}
          </div>
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
  );
}
