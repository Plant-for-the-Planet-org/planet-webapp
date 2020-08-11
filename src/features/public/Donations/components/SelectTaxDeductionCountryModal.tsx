import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { withStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import  { getCountryDataBy } from '../../../../utils/countryUtils'
let styles = require('./../styles/SelectCurrencyModal.module.scss');

export default function TransitionsModal(props:any) {
  const {
    openModal,
    handleModalClose,
    taxDeductionCountries,
    setCountry,
    country,
    setCurrency,
    currency
  } = props;

  
  const [countriesData, setCountriesData] = useState([])
  const [selectedModalValue, setSelectedModalValue] = useState(``)


  // changes the currency in when a currency is selected
  const handleCountryChange = (event:any) => {
      setSelectedModalValue(event.target.value);
  };

  // changes the language and currency code in footer state and local storage
  // when user clicks on OK
  function handleOKClick() {
    const selectedData = selectedModalValue.split(",")
    setCountry(selectedData[0])
    setCurrency(selectedData[1])
    handleModalClose();
  }

  React.useEffect(()=> {
    const tempCountriesData:any = []
    taxDeductionCountries.forEach(countryCode => tempCountriesData.push(getCountryDataBy('countryCode', countryCode)))
    setCountriesData(tempCountriesData)
  }, [])

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
              <p className={styles.sectionHead}>Select Country</p>
              {/* maps the radio button for country */}
              <MapCountry
                countriesData={countriesData}
                // this is selectedValue,
                value={selectedModalValue}
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

// Maps the radio buttons for currency
function MapCountry(props:any) {
  const { countriesData, value, handleChange } = props;
  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="language"
        name="language"
        value={value}
        onChange={handleChange}
      >
        {countriesData.map((country:any) => (
          <FormControlLabel
            value={`${country.countryCode},${country.currencyCode}`} // need both info
            control={<GreenRadio />}
            label={`${country.countryName} - (${country.countryCode})`}
            // label={`${country.countryCode},${country.currencyCode}`}
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
