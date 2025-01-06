import type { ChangeEvent } from 'react';
import type { CountryCode } from '@planet-sdk/common';

import {
  Modal,
  Fade,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  getCountryDataBy,
  sortCountriesByTranslation,
} from '../../../../utils/countryCurrency/countryUtils';
import { getStoredConfig } from '../../../../utils/storeConfig';
import supportedLanguages from '../../../../utils/language/supportedLanguages.json';
import { ThemeContext } from '../../../../theme/themeContext';
import GreenRadio from '../../InputTypes/GreenRadio';
import styles from './SelectLanguageAndCountry.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { useTenant } from '../TenantContext';
import { useRouter } from 'next/router';
import { useCurrency } from '../CurrencyContext';

interface MapCountryProps {
  value: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
}
interface MapLanguageProps {
  value: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
}
interface TransitionsModalProps {
  openModal: boolean;
  handleModalClose: () => void;
  setSelectedCurrency: Function;
  selectedCountry: string;
  setSelectedCountry: Function;
  setCurrencyCode?: Function;
}

interface countryInterface {
  countryName: string;
  countryCode: CountryCode;
  currencyName: string;
  currencyCode: string;
  currencyCountryFlag: string;
  languageCode: string;
}

// Maps the radio buttons for language

function MapLanguage({ value, handleChange }: MapLanguageProps) {
  const { tenantConfig } = useTenant();

  // reduce the allowed languages to the languages listed in the tenants config file
  const selectableLanguages = useMemo(
    () =>
      supportedLanguages.filter((lang) =>
        Object.values(tenantConfig.config.languages ?? { 0: 'en' }).includes(
          lang.langCode
        )
      ),
    [supportedLanguages, tenantConfig.config.languages]
  );

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
  const t = useTranslations('Country');
  const { supportedCurrencies } = useCurrency();
  const locale = useLocale();
  const country = getStoredConfig('country');
  const priorityCountries = country === value ? [value] : [value, country];
  const sortedCountriesData = sortCountriesByTranslation(
    t,
    locale,
    priorityCountries,
    supportedCurrencies
  );
  return (
    <FormControl variant="standard" component="fieldset">
      <RadioGroup
        aria-label="language"
        name="language"
        value={value}
        onChange={handleChange}
        className={styles.currencyGrid}
      >
        {sortedCountriesData.map((country: countryInterface) => (
          <FormControlLabel
            key={country.countryCode}
            value={country.countryCode}
            control={<GreenRadio />}
            label={
              t(country.countryCode.toLowerCase()) +
              ' · ' +
              country.currencyCode
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
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

  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();

  const { theme } = useContext(ThemeContext);

  // changes the language in when a language is selected
  const handleLanguageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setModalLanguage(event.target.value);
  };

  // changes the country code in when a country is selected
  const handleCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedModalCountry(event.target.value);
  };

  // changes the language and currency code in footer state and local storage
  // when user clicks on OK
  function handleOKClick() {
    window.localStorage.setItem('countryCode', selectedModalCountry);
    setSelectedCountry(selectedModalCountry);
    const currencyCode = (
      getCountryDataBy('countryCode', selectedModalCountry) as countryInterface
    ).currencyCode;
    if (currencyCode) {
      window.localStorage.setItem('currencyCode', currencyCode);
      setSelectedCurrency(currencyCode);
      if (setCurrencyCode) setCurrencyCode(currencyCode);
    }
    // TODOO - loader while changing the locale
    if (modalLanguage !== locale) {
      const { asPath, pathname } = router;
      if (pathname === '/sites/[slug]/[locale]' || pathname === `/${locale}`) {
        router.replace(encodeURI(`/${modalLanguage}`));
      } else {
        const splitPathnames = asPath.split('/');
        if (splitPathnames.length > 2) {
          const newPathname = splitPathnames.slice(2).join('/');
          router.replace(encodeURI(`/${modalLanguage}/${newPathname}`));
        } else {
          router.replace(encodeURI(`/${modalLanguage}`));
        }
      }
    }
    handleModalClose();
  }

  useEffect(() => {
    if (locale) {
      setModalLanguage(locale);
    }
  }, [locale]);
  // changes the selected country in local state whenever the currency changes
  // in Footer state
  useEffect(() => {
    if (selectedCountry) {
      setSelectedModalCountry(selectedCountry);
    }
  }, [selectedCountry]);

  return (
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
              <p className={styles.sectionHead}>{tCommon('selectLanguage')}</p>
              {/* maps the radio button for languages */}
              <MapLanguage
                value={modalLanguage}
                handleChange={handleLanguageChange}
              />
              <p className={styles.sectionHead}>{tCommon('selectCountry')}</p>
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
                <p>{tCommon('cancel')}</p>
              </button>
              <button
                id={'selLangAndCountryOk'}
                className={styles.button}
                onClick={handleOKClick}
              >
                <div></div>
                <p>{tCommon('ok')}</p>
              </button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
