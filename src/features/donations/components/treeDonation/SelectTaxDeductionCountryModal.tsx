import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { useState } from 'react';
import { getCountryDataBy } from '../../../../utils/countryCurrency/countryUtils';
import { ThemeContext } from '../../../../theme/themeContext';
import GreenRadio from '../../../common/InputTypes/GreenRadio';
import i18next from '../../../../../i18n';
import styles from './../../styles/SelectCurrencyModal.module.scss';

const { useTranslation } = i18next;

export default function TransitionsModal(props: any) {
  const {
    openModal,
    handleModalClose,
    taxDeductionCountries,
    setCountry,
    country,
    setCurrency,
    currency,
  } = props;

  const { t, ready } = useTranslation(['donate', 'common']);

  const [countriesData, setCountriesData] = useState([]);
  const [selectedModalValue, setSelectedModalValue] = useState(
    `${country},${currency}`
  );

  const { theme } = React.useContext(ThemeContext);

  // changes the currency in when a currency is selected
  const handleCountryChange = (event: any) => {
    setSelectedModalValue(event.target.value);
  };

  // changes the language and currency code in footer state and local storage
  // when user clicks on OK
  function handleOKClick() {
    const selectedData = selectedModalValue.split(',');
    setCountry(selectedData[0]);
    setCurrency(selectedData[1]);
    handleModalClose();
  }

  React.useEffect(() => {
    setSelectedModalValue(`${country},${currency}`);
  }, [country, currency]);

  React.useEffect(() => {
    const tempCountriesData: any = [];
    taxDeductionCountries.forEach((countryCode: string) =>
      tempCountriesData.push(getCountryDataBy('countryCode', countryCode))
    );
    setCountriesData(tempCountriesData);
  }, []);

  return ready ? (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={'modalContainer' + ' ' + theme}
        open={openModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={styles.modal} style={{ height: 'auto' }}>
            <div className={styles.radioButtonsContainer}>
              <p className={styles.sectionHead}>{t('common:selectCountry')}</p>
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
              <button id={'selectTaxDedCan'} className={styles.button} onClick={handleModalClose}>
                <div></div>
                <p>{t('common:cancel')}</p>
              </button>
              <button id={'selectTaxDedOk'} className={styles.button} onClick={handleOKClick}>
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

// Maps the radio buttons for currency
function MapCountry(props: any) {
  const { t, ready } = useTranslation(['country']);
  
  const { countriesData, value, handleChange } = props;
  return ready ? (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="language"
        name="language"
        value={value}
        onChange={handleChange}
      >
        {countriesData.map((country: any, index: number) => (
          <FormControlLabel
            key={country.countryCode + '-' + index}
            value={`${country.countryCode},${country.currencyCode}`} // need both info
            control={<GreenRadio />}
            label={t('country:' + country.countryCode.toLowerCase()) + ' · ' + country.currencyCode}
          />
        ))}
      </RadioGroup>
    </FormControl>
  ) : null;
}
