import type { ReactElement } from 'react';

import { useEffect, useState } from 'react';
import UNEPLogo from '../../../../../public/assets/images/footer/UNEPLogo';
import World from '../../../../../public/assets/images/footer/World';
import getLanguageName from '../../../../utils/language/getLanguageName';
import styles from './Footer.module.scss';
import SelectLanguageAndCountry from './SelectLanguageAndCountry';
import { useLocale, useTranslations } from 'next-intl';
import { useTenant } from '../TenantContext';
import UNDecadeLogo from '../../../../../public/assets/images/footer/UNDecadeLogo';
import PlanetCJLogo from '../../../../../public/assets/images/footer/PlanetCJLogo';

// let styles = require('./Footer.module.css');
export default function Footer(): ReactElement | null {
  const t = useTranslations('Common');
  const locale = useLocale();
  const { tenantConfig } = useTenant();
  const [openModal, setOpenModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [selectedCountry, setSelectedCountry] = useState('DE');
  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const FooterLinks = {
    shop: {
      title: t('shop'),
      link: `https://www.thegoodshop.org/de`,
    },
    privacy: {
      title: t('privacy'),
      link: `https://pp.eco/legal/${locale}/privacy`,
    },
    terms: {
      title: t('terms'),
      link: `https://pp.eco/legal/${locale}/terms`,
    },
    imprint: {
      title: t('imprint'),
      link: `https://pp.eco/legal/${locale}/imprint`,
    },
    contact: {
      title: t('contact'),
      link: 'mailto:support@plant-for-the-planet.org',
    },
    downloads: {
      title: t('downloads'),
      link: `https://www.plant-for-the-planet.org/${locale}/download`,
    },
    annualReports: {
      title: t('annualReports'),
      link: `https://www.plant-for-the-planet.org/annual-reports`,
    },
    team: {
      title: t('team'),
      link: `https://www.plant-for-the-planet.org/team`,
    },
    jobs: {
      title: t('jobs'),
      link: `https://www.plant-for-the-planet.org/${locale}/careers`,
    },
    supportUs: {
      title: t('supportUs'),
      link: `https://www.plant-for-the-planet.org/${locale}/donation`,
    },
    blogs: {
      title: t('blogs'),
      link: `https://blog.plant-for-the-planet.org/${locale}`,
    },
    faqs: {
      title: t('faqs'),
      link: `https://www.plant-for-the-planet.org/${locale}/faq`,
    },
  };

  // changes the language and selected country as found in local storage
  useEffect(() => {
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('currencyCode')) {
        const currencyCode = localStorage.getItem('currencyCode');
        if (currencyCode) setSelectedCurrency(currencyCode);
      }
      if (localStorage.getItem('countryCode')) {
        const countryCode = localStorage.getItem('countryCode');
        if (countryCode) setSelectedCountry(countryCode);
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
              <button
                id={'worldIcon'}
                onClick={handleModalOpen}
                className={styles.footer_button}
              >
                <World />
                <p className={styles.selected_language}>
                  {`${getLanguageName(locale)} · ${selectedCurrency}`}
                </p>
              </button>
              <div className={styles.footer_social_container}>
                <button id={'facebookIcon'}>
                  <a
                    className={styles.social_button}
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.facebook.com/plantfortheplanet"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      viewBox="0 0 46 46"
                    >
                      <g
                        id="Group_3315"
                        data-name="Group 3315"
                        transform="translate(-393.342 -502.758)"
                      >
                        <g
                          className="iconFillNone"
                          id="Ellipse_1312"
                          data-name="Ellipse 1312"
                          transform="translate(393.342 502.758)"
                          strokeWidth="1"
                        >
                          <circle cx="23" cy="23" r="23" stroke="none" />
                          <circle
                            className="iconFillNone"
                            cx="23"
                            cy="23"
                            r="22.5"
                          />
                        </g>
                        <path
                          className="iconFillColor"
                          id="Icon_awesome-facebook-f"
                          data-name="Icon awesome-facebook-f"
                          d="M18.446,18.32l.9-5.894H13.695V8.6c0-1.613.79-3.184,3.323-3.184h2.571V.4A31.354,31.354,0,0,0,15.025,0c-4.658,0-7.7,2.823-7.7,7.933v4.492H2.146V18.32H7.323V32.568h6.372V18.32Z"
                          transform="translate(406.195 515.704)"
                        />
                      </g>
                    </svg>
                  </a>
                </button>

                <button id={'instagramIcon'}>
                  <a
                    className={styles.social_button}
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.instagram.com/plantfortheplanet_official/"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      viewBox="0 0 46 46"
                    >
                      <g
                        id="Group_3317"
                        data-name="Group 3317"
                        transform="translate(-548.604 -496.605)"
                      >
                        <g
                          className="iconFillNone"
                          id="Ellipse_1311"
                          data-name="Ellipse 1311"
                          transform="translate(548.604 496.605)"
                          strokeWidth="1"
                        >
                          <circle cx="23" cy="23" r="23" stroke="none" />
                          <circle
                            className="iconFillNone"
                            cx="23"
                            cy="23"
                            r="22.5"
                          />
                        </g>
                        <path
                          className="iconFillColor"
                          id="Icon_simple-instagram"
                          data-name="Icon simple-instagram"
                          d="M13.31,0C9.694,0,9.242.017,7.823.08A9.814,9.814,0,0,0,4.592.7,6.518,6.518,0,0,0,2.234,2.234,6.494,6.494,0,0,0,.7,4.592,9.785,9.785,0,0,0,.08,7.823C.013,9.242,0,9.694,0,13.31S.017,17.377.08,18.8A9.82,9.82,0,0,0,.7,22.027a6.527,6.527,0,0,0,1.535,2.358A6.508,6.508,0,0,0,4.592,25.92a9.826,9.826,0,0,0,3.231.619c1.42.067,1.871.08,5.487.08s4.067-.017,5.487-.08a9.849,9.849,0,0,0,3.231-.619,6.8,6.8,0,0,0,3.893-3.893,9.82,9.82,0,0,0,.619-3.231c.067-1.42.08-1.871.08-5.487s-.017-4.067-.08-5.487a9.843,9.843,0,0,0-.619-3.231,6.532,6.532,0,0,0-1.535-2.358A6.485,6.485,0,0,0,22.027.7,9.792,9.792,0,0,0,18.8.08C17.377.013,16.925,0,13.31,0Zm0,2.4c3.553,0,3.976.018,5.379.079a7.333,7.333,0,0,1,2.47.46A4.38,4.38,0,0,1,23.685,5.46a7.349,7.349,0,0,1,.458,2.47c.063,1.4.078,1.826.078,5.379s-.017,3.976-.082,5.379a7.49,7.49,0,0,1-.467,2.47,4.226,4.226,0,0,1-1,1.533,4.152,4.152,0,0,1-1.531.994,7.4,7.4,0,0,1-2.479.458c-1.413.063-1.829.078-5.389.078S9.3,24.2,7.887,24.139a7.547,7.547,0,0,1-2.48-.467,4.122,4.122,0,0,1-1.529-1,4.041,4.041,0,0,1-1-1.531,7.553,7.553,0,0,1-.466-2.479c-.05-1.4-.068-1.829-.068-5.373s.018-3.977.068-5.391a7.545,7.545,0,0,1,.466-2.478,3.945,3.945,0,0,1,1-1.532,3.937,3.937,0,0,1,1.529-1A7.367,7.367,0,0,1,7.87,2.429c1.414-.05,1.83-.067,5.389-.067l.05.033Zm0,4.079a6.834,6.834,0,1,0,6.834,6.834A6.834,6.834,0,0,0,13.31,6.475Zm0,11.271a4.437,4.437,0,1,1,4.437-4.437A4.435,4.435,0,0,1,13.31,17.746Zm8.7-11.541a1.6,1.6,0,1,1-1.6-1.6A1.6,1.6,0,0,1,22.012,6.206Z"
                          transform="translate(558.604 506.604)"
                        />
                      </g>
                    </svg>
                  </a>
                </button>

                <button id={'linkedInIcon'}>
                  <a
                    className={styles.social_button}
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.linkedin.com/company/plant-for-the-planet/mycompany/"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      viewBox="0 0 46 46"
                    >
                      <g
                        data-name="Group 3313"
                        transform="translate(5512 4937.531)"
                      >
                        <g
                          className="iconFillNone"
                          strokeWidth="1"
                          data-name="Ellipse 1311"
                          transform="translate(-5512 -4937.531)"
                        >
                          <circle cx="23" cy="23" r="23" stroke="none"></circle>
                          <circle cx="23" cy="23" r="22.5"></circle>
                        </g>
                        <path
                          className="iconFillColor"
                          d="M5.959 26.63H.44V8.857h5.519zM3.2 6.433a3.211 3.211 0 113.2-3.227 3.223 3.223 0 01-3.2 3.227zm23.418 20.2h-5.51v-8.655c0-2.062-.042-4.706-2.869-4.706-2.869 0-3.309 2.24-3.309 4.558v8.8H9.416V8.857h5.293v2.424h.077a5.8 5.8 0 015.222-2.87c5.586 0 6.612 3.678 6.612 8.456v9.763z"
                          transform="translate(-5501.833 -4929.03)"
                        ></path>
                      </g>
                    </svg>
                  </a>
                </button>

                <button id={'youtubeIcon'}>
                  <a
                    className={styles.social_button}
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.youtube.com/user/PlantForThePlanet"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      viewBox="0 0 46 46"
                    >
                      <g
                        data-name="Group 3314"
                        transform="translate(5446 4937.531)"
                      >
                        <g
                          className="iconFillNone"
                          strokeWidth="1"
                          data-name="Ellipse 1493"
                          transform="translate(-5446 -4937.531)"
                        >
                          <circle cx="23" cy="23" r="23" stroke="none"></circle>
                          <circle cx="23" cy="23" r="22.5"></circle>
                        </g>
                        <path
                          className="iconFillColor"
                          d="M41 66.929a3.345 3.345 0 00-2.353-2.369c-2.076-.56-10.4-.56-10.4-.56s-8.324 0-10.4.56a3.345 3.345 0 00-2.353 2.369 37.661 37.661 0 000 12.9 3.3 3.3 0 002.353 2.331c2.076.56 10.4.56 10.4.56s8.324 0 10.4-.56A3.3 3.3 0 0041 79.826a37.661 37.661 0 000-12.9zM25.52 77.336v-7.917l6.957 3.958z"
                          transform="translate(-5451.6 -4987.89)"
                        ></path>
                      </g>
                    </svg>
                  </a>
                </button>

                <button id={'flickrIcon'}>
                  <a
                    className={styles.social_button}
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.flickr.com/people/plant-for-the-planet/"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      viewBox="0 0 46 46"
                    >
                      <g
                        data-name="Group 3315"
                        transform="translate(5539.69 4833.09)"
                      >
                        <path
                          className="iconFillColor"
                          d="M23.768 32H2.852A2.853 2.853 0 000 34.852v20.916a2.853 2.853 0 002.852 2.852h20.916a2.853 2.853 0 002.852-2.852V34.852A2.853 2.853 0 0023.768 32zM8.586 49.053a3.773 3.773 0 113.773-3.773 3.771 3.771 0 01-3.773 3.773zm9.448 0a3.773 3.773 0 113.773-3.773 3.771 3.771 0 01-3.773 3.773z"
                          transform="translate(-5530 -4855.4)"
                        ></path>
                        <g
                          className="iconFillNone"
                          stroke="#2f3336"
                          strokeWidth="1"
                          data-name="Ellipse 1494"
                          transform="translate(-5539.69 -4833.09)"
                        >
                          <circle cx="23" cy="23" r="23" stroke="none"></circle>
                          <circle cx="23" cy="23" r="22.5"></circle>
                        </g>
                      </g>
                    </svg>
                  </a>
                </button>
                <button id={'tiktokIcon'}>
                  <a
                    className={styles.social_button}
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.tiktok.com/@plantfortheplanet.org"
                  >
                    <svg
                      width="46"
                      height="46"
                      viewBox="0 0 46 46"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="23"
                        cy="23"
                        r="22.5"
                        fill="white"
                        stroke="#2F3336"
                      />
                      <path
                        d="M34.6241 20.0723C32.3019 20.0778 30.0366 19.3536 28.1483 18.0019V27.429C28.1477 29.175 27.614 30.8792 26.6186 32.3137C25.6233 33.7482 24.2137 34.8447 22.5784 35.4564C20.9431 36.0682 19.16 36.1662 17.4675 35.7372C15.7751 35.3082 14.2539 34.3727 13.1074 33.0559C11.9609 31.739 11.2438 30.1036 11.0519 28.3681C10.8601 26.6327 11.2026 24.8801 12.0337 23.3446C12.8648 21.8091 14.1448 20.5639 15.7027 19.7755C17.2606 18.9871 19.022 18.6932 20.7515 18.9329V23.6744C19.9601 23.4255 19.1103 23.433 18.3234 23.6958C17.5365 23.9587 16.8528 24.4635 16.3699 25.1381C15.887 25.8127 15.6296 26.6227 15.6345 27.4523C15.6394 28.2819 15.9063 29.0888 16.3971 29.7576C16.8879 30.4265 17.5775 30.9232 18.3674 31.1768C19.1574 31.4303 20.0072 31.4278 20.7956 31.1696C21.584 30.9114 22.2707 30.4106 22.7575 29.7388C23.2444 29.0671 23.5065 28.2586 23.5065 27.429V9H28.1483C28.1451 9.39199 28.1779 9.78344 28.2464 10.1694V10.1694C28.4077 11.031 28.7431 11.8507 29.232 12.5783C29.721 13.3058 30.3532 13.926 31.09 14.4008C32.1383 15.094 33.3674 15.4634 34.6241 15.4632V20.0723Z"
                        fill="#2F3336"
                      />
                    </svg>
                  </a>
                </button>
              </div>
            </div>
            <div className={styles.footer_links_container}>
              {/* {tenantConfig.config.darkModeEnabled && (
                <div className={styles.switch}>
                  <DarkModeSwitch />
                </div>
              )} */}

              {/* <p className={styles.footer_links}>© 2020 Plant-for-the-Planet</p> */}
              {tenantConfig.config.footerLinks &&
                tenantConfig.config.footerLinks.map((key) => {
                  const footerLinkKey = key as keyof typeof FooterLinks;
                  return (
                    <a
                      key={FooterLinks[footerLinkKey].title}
                      href={FooterLinks[footerLinkKey].link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className={styles.footer_links}>
                        {FooterLinks[footerLinkKey].title}
                      </p>
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
        <div className={styles.logo_container}>
          <button id={'pfpLogoIcon'} className={styles.pfp_logo_container}>
            <a
              href="http://www.plant-for-the-planet.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <PlanetCJLogo />
            </a>
          </button>

          {tenantConfig.config.showUNEPLogo && (
            <button id={'unepLogoIcon'} className={styles.unep_logo_container}>
              <a
                href="https://www.unep.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className={styles.unep_logo_text}>{t('supportsUNEP')} </p>
                <UNEPLogo />
              </a>
            </button>
          )}

          {tenantConfig.config.showUNDecadeLogo && (
            <button
              id={'undecadeLogoIcon'}
              className={styles.undecade_logo_container}
            >
              <a
                href="https://www.decadeonrestoration.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <UNDecadeLogo />
              </a>
            </button>
          )}
        </div>
        <SelectLanguageAndCountry
          openModal={openModal}
          handleModalClose={handleModalClose}
          setSelectedCurrency={setSelectedCurrency}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      </div>
    </footer>
  );
}
