import {
  Modal,
  Fade,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  getCountryDataBy,
  sortCountriesByTranslation,
} from '../../../../utils/countryCurrency/countryUtils';
import { getStoredConfig } from '../../../../utils/storeConfig';
import supportedLanguages from '../../../../utils/language/supportedLanguages.json';
import { ThemeContext } from '../../../../theme/themeContext';
import GreenRadio from '../../InputTypes/GreenRadio';
import styles from './SelectLanguageAndCountry.module.scss';
import { useTranslation } from 'next-i18next';
import tenantConfig from '../../../../../tenant.config';

interface MapCountryProps {
  value: string;
  handleChange: Function;
}
interface MapLanguageProps {
  value: string;
  handleChange: Function;
}
interface TransitionsModalProps {
  openModal: boolean;
  handleModalClose: Function;
  setLanguage: Function;
  language: any;
  setSelectedCurrency: Function;
  selectedCountry: any;
  setSelectedCountry: Function;
  setCurrencyCode?: Function;
}
const config = tenantConfig();

// reduce the allowed languages to the languages listed in the tenants config file
const selectableLanguages = supportedLanguages.filter((lang) =>
  config.languages.includes(lang.langCode)
);

// Maps the radio buttons for language

function MapLanguage({ value, handleChange }: MapLanguageProps) {
  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="language"
        name="language"
        value={value}
        onChange={handleChange}
        className={styles.currencyGrid}
      >
        {selectableLanguages.map((lang) => (
          <FormControlLabel
            key={lang.langCode}
            value={lang.langCode}
            control={<GreenRadio />}
            label={lang.languageName}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

// Maps the radio buttons for countries
function MapCountry({ value, handleChange }: MapCountryProps) {
  const { t, i18n, ready } = useTranslation(['country']);
  const country = getStoredConfig('country');
  const priorityCountries = country === value ? [value] : [value, country];
  const sortedCountriesData = ready
    ? sortCountriesByTranslation(t, i18n.language, priorityCountries)
    : {};
  return ready ? (
    <FormControl variant="standard" component="fieldset">
      <RadioGroup
        aria-label="language"
        name="language"
        value={value}
        onChange={handleChange}
        className={styles.currencyGrid}
      >
        {sortedCountriesData.map((country) => (
          <FormControlLabel
            key={country.countryCode}
            value={country.countryCode}
            control={<GreenRadio />}
            label={
              t('country:' + country.countryCode.toLowerCase()) +
              ' · ' +
              country.currencyCode
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  ) : null;
}

export default function TransitionsModal({
  openModal,
  handleModalClose,
  setSelectedCurrency,
  selectedCountry,
  setSelectedCountry,
  setCurrencyCode,
}: TransitionsModalProps) {
  const [modalLanguage, setModalLanguage] = useState('en');
  const [selectedModalCountry, setSelectedModalCountry] = useState('DE');

  const { t, i18n, ready } = useTranslation(['common', 'country']);

  const { theme } = React.useContext(ThemeContext);

  // changes the language in when a language is selected
  const handleLanguageChange = (event) => {
    setModalLanguage(event.target.value);
  };

  // changes the country code in when a country is selected
  const handleCountryChange = (event) => {
    setSelectedModalCountry(event.target.value);
  };

  // changes the language and currency code in footer state and local storage
  // when user clicks on OK
  function handleOKClick() {
    // window.localStorage.setItem('language', modalLanguage);

    i18n.changeLanguage(modalLanguage);
    window.localStorage.setItem('language', modalLanguage);
    window.localStorage.setItem('countryCode', selectedModalCountry);
    setSelectedCountry(selectedModalCountry);
    const currencyCode = getCountryDataBy(
      'countryCode',
      selectedModalCountry
    ).currencyCode;
    if (currencyCode) {
      window.localStorage.setItem('currencyCode', currencyCode);
      setSelectedCurrency(currencyCode);
      if (setCurrencyCode) setCurrencyCode(currencyCode);
    }
    handleModalClose();
  }

  useEffect(() => {
    if (i18n.language) {
      setModalLanguage(i18n.language);
    }
  }, [i18n.language]);
  // changes the selected country in local state whenever the currency changes
  // in Footer state
  useEffect(() => {
    if (selectedCountry) {
      setSelectedModalCountry(selectedCountry);
    }
  }, [selectedCountry]);

  return ready ? (
    <div>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={'modalContainer ' + theme}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={styles.modal}>
            <div className={styles.radioButtonsContainer}>
              <p className={styles.sectionHead}>{t('common:selectLanguage')}</p>
              {/* maps the radio button for languages */}
              <MapLanguage
                value={modalLanguage}
                handleChange={handleLanguageChange}
              />
              <p className={styles.sectionHead}>{t('common:selectCountry')}</p>
              {/* maps the radio button for countries */}
              <MapCountry
                value={selectedModalCountry}
                handleChange={handleCountryChange}
              />
            </div>
            {/* modal buttons */}
            <div className={styles.buttonContainer}>
              <button
                id={'selLangAndCountryCan'}
                className={styles.button}
                onClick={handleModalClose}
              >
                <div></div>
                <p>{t('common:cancel')}</p>
              </button>
              <button
                id={'selLangAndCountryOk'}
                className={styles.button}
                onClick={handleOKClick}
              >
                <div></div>
                <p>{t('common:ok')}</p>
              </button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  ) : null;
}
