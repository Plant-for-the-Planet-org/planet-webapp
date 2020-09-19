import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { useEffect, useState } from 'react';
import countriesData from '../../../utils/countriesData.json';
import {
  getCountryDataBy,
  sortCountriesData
} from '../../../utils/countryUtils';
import supportedLanguages from '../../../utils/supportedLanguages.json';
import { ThemeContext } from '../../../utils/themeContext';
import GreenRadio from '../InputTypes/GreenRadio';
let styles = require('./SelectLanguageAndCountry.module.scss');

export default function TransitionsModal(props) {
  const {
    openModal,
    handleModalClose,
    setLanguage,
    language,
    setSelectedCurrency,
    selectedCountry,
    setSelectedCountry,
  } = props;
  const [modalLanguage, setModalLanguage] = useState('en');
  const [selectedModalCountry, setSelectedModalCountry] = useState('AF');
  const [sortedCountriesData, setSortedCountriesData] = useState(countriesData);

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
    window.localStorage.setItem('language', modalLanguage);
    setLanguage(modalLanguage);
    window.localStorage.setItem('countryCode', selectedModalCountry);
    setSelectedCountry(selectedModalCountry);
    let currencyCode = getCountryDataBy('countryCode', selectedModalCountry)
      .currencyCode;
    if (currencyCode) {
      window.localStorage.setItem('currencyCode', currencyCode);
      setSelectedCurrency(currencyCode);
    }
    handleModalClose();
  }

  // changes the language in local state whenever the language changes in Footer state
  useEffect(() => {
    if (language) {
      setModalLanguage(language);
    }
  }, [language]);

  // changes the selected country in local state whenever the currency changes
  // in Footer state
  useEffect(() => {
    if (selectedCountry) {
      setSelectedModalCountry(selectedCountry);
    }
  }, [selectedCountry]);

  // sorts the country data by country name as soon as the page loads
  useEffect(() => {
    setSortedCountriesData(sortCountriesData('countryName'));
  }, []);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.modalContainer + ' ' + theme}
        open={openModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={styles.modal}>
            <div className={styles.radioButtonsContainer}>
              <p className={styles.sectionHead}>Select a Language</p>
              {/* maps the radio button for languages */}
              <MapLanguage
                value={modalLanguage}
                handleChange={handleLanguageChange}
              />
              <p className={styles.sectionHead}>Select your Country</p>
              {/* maps the radio button for countries */}
              <MapCountry
                sortedCountriesData={sortedCountriesData}
                value={selectedModalCountry}
                handleChange={handleCountryChange}
              />
            </div>
            {/* modal buttons */}
            <div className={styles.buttonContainer}>
              <div className={styles.button} onClick={handleModalClose}>
                <div></div>
                <p>Cancel</p>
              </div>
              <div className={styles.button} onClick={handleOKClick}>
                <div></div>
                <p>OK</p>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

// Maps the radio buttons for countries
function MapCountry(props) {
  const { sortedCountriesData, value, handleChange } = props;
  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="language"
        name="language"
        value={value}
        onChange={handleChange}
        className={styles.currencyGrid}
      >
        {sortedCountriesData.map((country) => (
          <FormControlLabel
            value={country.countryCode}
            control={<GreenRadio />}
            label={`${country.countryName} · ${country.currencyCode}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

// Maps the radio buttons for language
function MapLanguage(props) {
  const { value, handleChange } = props;
  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="language"
        name="language"
        value={value}
        onChange={handleChange}
        className={styles.currencyGrid}
      >
        {supportedLanguages.map((lang) => (
          <FormControlLabel
            value={lang.langCode}
            control={<GreenRadio />}
            label={lang.languageName}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
