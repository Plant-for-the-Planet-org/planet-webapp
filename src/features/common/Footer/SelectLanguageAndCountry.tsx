import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { withStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import countriesData from '../../../utils/countriesData.json';
import {
  getCountryDataBy,
  sortCountriesData,
} from '../../../utils/countryUtils';
import supportedLanguages from '../../../utils/supportedLanguages.json';
let styles = require('./SelectLanguageAndCountry.module.scss');

export default function TransitionsModal(props) {
  const {
    openModal,
    handleModalClose,
    setLanguage,
    language,
    selectedCurrency,
    setSelectedCurrency,
  } = props;
  const [modalLanguage, setModalLanguage] = useState('en');
  const [selectedCountry, setSelectedCountry] = useState('AF');
  const [sortedCountriesData, setSortedCountriesData] = useState(countriesData);

  // changes the language in when a language is selected
  const handleLanguageChange = (event) => {
    setModalLanguage(event.target.value);
  };

  // changes the country code in when a country is selected
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  // changes the language and currency code in footer state and local storage
  // when user clicks on OK
  function handleOKClick() {
    window.localStorage.setItem('language', modalLanguage);
    setLanguage(modalLanguage);
    let currencyCode = getCountryDataBy('countryCode', selectedCountry)
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
      console.log('language', language);
      setModalLanguage(language);
    }
  }, [language]);

  // changes the selected country in local state whenever the currency changes
  // in Footer state
  useEffect(() => {
    if (selectedCurrency) {
      setSelectedCountry(
        getCountryDataBy('currencyCode', selectedCurrency).countryCode
      );
    }
  }, [selectedCurrency]);

  // sorts the country data by country name as soon as the page loads
  useEffect(() => {
    setSortedCountriesData(sortCountriesData('countryName'));
  }, []);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.modalContainer}
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
            <div style={{ padding: '20px' }}>
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
                value={selectedCountry}
                handleChange={handleCountryChange}
              />
            </div>
            {/* modal buttons */}
            <div className={styles.buttonContainer}>
              <p onClick={handleModalClose}>Cancel</p>
              <p onClick={handleOKClick}>OK</p>
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
      >
        {sortedCountriesData.map((country) => (
          <FormControlLabel
            value={country.countryCode}
            control={<GreenRadio />}
            label={`${country.countryName} (${country.currencyCode})`}
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

// styles the radio button to green color for selected state
const GreenRadio = withStyles({
  root: {
    color: '#000000',
    '&$checked': {
      color: '#89B53A',
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);
