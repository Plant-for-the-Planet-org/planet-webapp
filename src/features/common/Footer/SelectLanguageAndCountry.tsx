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
import { sortCountriesData } from '../../../utils/countryUtils';
import supportedLanguages from '../../../utils/supportedLanguages.json';
let styles = require('./SelectLanguageAndCountry.module.scss');

export default function TransitionsModal(props) {
  const { openModal, handleModalClose } = props;
  const [language, setLanguage] = useState('en');
  const [selectedCountry, setSelectedCountry] = useState('AF');
  const [sortedCountriesData, setSortedCountriesData] = useState(countriesData);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  useEffect(() => {
    setSortedCountriesData(sortCountriesData('countryName'));
    if (localStorage.getItem('countryCode')) {
      setSelectedCountry(localStorage.getItem('countryCode'));
    }
    if (localStorage.getItem('language')) {
      setLanguage(localStorage.getItem('language'));
    }
  }, []);

  function handleOKClick() {
    window.localStorage.setItem('language', language);
    window.localStorage.setItem('countryCode', selectedCountry);
    handleModalClose();
  }

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
              <MapLanguage
                value={language}
                handleChange={handleLanguageChange}
              />
              <p className={styles.sectionHead}>Select your Country</p>
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
