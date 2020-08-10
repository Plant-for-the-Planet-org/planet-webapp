import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AppStore from '../../../assets/images/footer/AppStore';
import GooglePlay from '../../../assets/images/footer/GooglePlay';
import UNEPLogo from '../../../assets/images/footer/UNEPLogo';
import World from '../../../assets/images/footer/World';
import PlanetLogo from '../../../assets/images/PlanetLogo';
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
    { id: 1, title: 'Privacy & Terms', link: '/' },
    { id: 2, title: 'Imprint', link: '/' },
    { id: 3, title: 'Contact', link: '/' },
    { id: 4, title: 'Press Releases', link: '/' },
    { id: 5, title: 'Report a project', link: '/' },
    { id: 6, title: 'Support Us', link: '/' },
    { id: 7, title: 'FAQs', link: '/' },
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
      // console.log('in footer', langCode, currencyCode, countryCode)
    }
  }, []);

  return (
    <footer>
      <div className="container">
        <div className={styles.hr} />

        <div className={styles.footer_container}>
          <div>
            <div className={styles.footer_button_container}>
              <div onClick={handleModalOpen} className={styles.footer_button}>
                <World />
                <p className={styles.selected_language}>
                  {`${getLanguageName(language)} (${selectedCurrency})`}
                </p>
              </div>
              <div className={styles.footer_button}>
                <GooglePlay />
                <p className={styles.selected_language_bold}>Google Play</p>
              </div>
              <div className={styles.footer_button}>
                <AppStore />
                <p className={styles.selected_language_bold}>App Store</p>
              </div>
            </div>
            <div className={styles.footer_links_container}>
              {/* <p className={styles.footer_links}>© 2020 Plant-for-the-Planet</p> */}
              {FooterLinks.map((link) => {
                return (
                  <Link key={link.id} href={link.link}>
                    <p className={styles.footer_links}>{link.title}</p>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className={styles.logo_container}>
            <div className={styles.pfp_logo}>
              <PlanetLogo />
            </div>
            <div className={styles.unep_logo_container}>
              <div>
                <p className={styles.unep_logo_text}>Supports the UNEP</p>
                <UNEPLogo />
              </div>
            </div>
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
