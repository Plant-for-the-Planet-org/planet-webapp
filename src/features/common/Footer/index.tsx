import React, { useEffect, useState } from 'react';
import AppleIcon from '../../../assets/images/footer/AppStore';
import GooglePlayIcon from '../../../assets/images/footer/GooglePlay';
import UNEPLogo from '../../../assets/images/footer/UNEPLogo';
import World from '../../../assets/images/footer/World';
import getLanguageName from '../../../utils/getLanguageName';
import styles from './Footer.module.scss';
import SelectLanguageAndCountry from './SelectLanguageAndCountry';

// let styles = require('./Footer.module.css');
export default function Footer() {
  const [openModal, setOpenModal] = useState(false);
  const [language, setLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [selectedCountry, setSelectedCountry] = useState('DE');

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const FooterLinks = [
    {
      id: 1,
      title: 'Privacy & Terms',
      link: 'https://www.plant-for-the-planet.org/en/footermenu/privacy-policy',
    },
    {
      id: 2,
      title: 'Imprint',
      link: 'https://www.plant-for-the-planet.org/en/footermenu/imprint',
    },
    {
      id: 3,
      title: 'Contact',
      link: 'https://www.plant-for-the-planet.org/en/footermenu/form',
    },
    {
      id: 6,
      title: 'Support Us',
      link: 'https://www.plant-for-the-planet.org/en/donation',
    },
  ];
  // changes the language and selected currency id found in local storage
  useEffect(() => {
    let langCode;
    let currencyCode;
    let countryCode;
    console.log(
      "localStorage.getItem('language')",
      localStorage.getItem('language')
    );
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
      // console.log('in footer', langCode, currencyCode, countryCode)
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
                  {`${getLanguageName(language)} (${selectedCurrency})`}
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
                  <a href={link.link} target="_blank">
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
                  alt="About Plant-for-the-Planet"
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
