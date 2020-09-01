import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { useEffect, useState } from 'react';
import countriesData from '../../../../../utils/countriesData.json';
import { sortCountriesData } from '../../../../../utils/countryUtils';
import GreenRadio from '../../../../common/InputTypes/GreenRadio';
let styles = require('./../../styles/SelectCurrencyModal.module.scss');

export default function TransitionsModal(props: any) {
  const {
    openModal,
    handleModalClose,
    setCurrency,
    setCountry,
    currency,
    country,
  } = props;

  const [sortedCountriesData, setSortedCountriesData] = useState(countriesData);
  //   const [selectedModalCurrency, setSelectedModalCurrency] = useState(currency)
  const [selectedModalValue, setSelectedModalValue] = useState(`${currency},${country}`);

  // changes the currency in when a currency is selected
  const handleCurrencyChange = (event: any) => {
    setSelectedModalValue(event.target.value);
  };

  const [importantList, setImportantList] = React.useState({})

  React.useEffect(() => {
    setImportantList(countriesData.filter(singleData =>
      singleData.currencyCode === currency // To Do - Create an array of local country plus selected country
    ))
  }, [currency])
  // changes the language and currency code in footer state and local storage
  // when user clicks on OK
  function handleOKClick() {
    const selectedInfo = selectedModalValue.split(',');
    setCurrency(selectedInfo[1]);
    setCountry(selectedInfo[0]);
    handleModalClose();
  }

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
            <div className={styles.radioButtonsContainer}>
              <p className={styles.sectionHead}>Select your Currency</p>
              {/* maps the radio button for currency */}
              <MapCurrency
                sortedCountriesData={importantList}
                // this is selectedValue, country wala object
                value={selectedModalValue}
                handleChange={handleCurrencyChange}
              />
              <MapCurrency
                sortedCountriesData={sortedCountriesData}
                // this is selectedValue, country wala object
                value={selectedModalValue}
                handleChange={handleCurrencyChange}
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

// Maps the radio buttons for currency
function MapCurrency(props: any) {
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
        {sortedCountriesData.map((country: any) => (
          <FormControlLabel
            value={`${country.countryCode},${country.currencyCode}`} // need both info
            control={<GreenRadio />}
            label={`${country.countryName} · ${country.currencyCode}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
