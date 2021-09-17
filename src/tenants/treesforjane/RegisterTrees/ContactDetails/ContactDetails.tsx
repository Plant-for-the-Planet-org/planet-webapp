import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import AutoCompleteCountry from './../../../../features/common/InputTypes/AutoCompleteCountry';
import MaterialTextField from './../../../../features/common/InputTypes/MaterialTextField';
import styles from '../RegisterModal.module.scss';
import i18next from '../../../../../i18n';
import COUNTRY_ADDRESS_POSTALS from '../../../../utils/countryZipCode';
import GeocoderArcGIS from 'geocoder-arcgis';
const { useTranslation } = i18next;

function ContactDetails({
  contactDetails,
  setContactDetails,
  register,
  errors,
  setValue,
}: any): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common']);

  // const { register, handleSubmit, errors, setValue } = useForm({ mode: 'all' });
  const [addressSugggestions, setaddressSugggestions] = React.useState([]);
  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
  );
  const suggestAddress = (value) => {
    if (value.length > 3) {
      geocoder
        .suggest(value, {
          category: 'Address',
          countryCode: contactDetails.country,
        })
        .then((result) => {
          const filterdSuggestions = result.suggestions.filter((suggestion) => {
            return !suggestion.isCollection;
          });
          setaddressSugggestions(filterdSuggestions);
        })
        .catch(console.log);
    }
  };
  const getAddress = (value) => {
    geocoder
      .findAddressCandidates(value, { outfields: '*' })
      .then((result) => {
        setValue('address', result.candidates[0].attributes.ShortLabel, {
          shouldValidate: true,
        });
        setValue('city', result.candidates[0].attributes.City, {
          shouldValidate: true,
        });
        setValue('zipCode', result.candidates[0].attributes.Postal, {
          shouldValidate: true,
        });
        setaddressSugggestions([]);
      })
      .catch(console.log);
  };

  const onSubmit = (data: any) => {
    const submitdata = data;
    setContactDetails({ ...contactDetails, ...submitdata });
  };

  const changeCountry = (country: any) => {
    setContactDetails({ ...contactDetails, country });
  };

  const [postalRegex, setPostalRegex] = React.useState(
    COUNTRY_ADDRESS_POSTALS.filter(
      (country) => country.abbrev === contactDetails.country
    )[0]?.postal
  );

  React.useEffect(() => {
    const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter(
      (country) => country.abbrev === contactDetails.country
    );
    setPostalRegex(fiteredCountry[0]?.postal);
  }, [contactDetails.country]);
  let suggestion_counter = 0;

  return ready ? (
    <div>
      <div className={styles.treeDonationContainer}>
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('donate:firstName')}
              variant="outlined"
              name="firstName"
              defaultValue={contactDetails.firstName}
            />
            {errors.firstName && (
              <span className={styles.formErrors}>
                {t('donate:firstNameRequired')}
              </span>
            )}
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('donate:lastName')}
              variant="outlined"
              name="lastName"
              defaultValue={contactDetails.lastName}
            />
            {errors.lastName && (
              <span className={styles.formErrors}>
                {t('donate:lastNameRequired')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formField}>
          <div className={styles.formFieldLarge}>
            <MaterialTextField
              inputRef={register({
                required: true,
                pattern:
                  /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
              })}
              label={t('donate:email')}
              variant="outlined"
              name="email"
              defaultValue={contactDetails.email}
            />
            {errors.email && (
              <span className={styles.formErrors}>
                {t('donate:emailRequired')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formField}>
          <div className={styles.formFieldLarge}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('donate:address')}
              variant="outlined"
              name="address"
              defaultValue={contactDetails.address}
              onChange={(event) => {
                suggestAddress(event.target.value);
              }}
              onBlur={() => setaddressSugggestions([])}
            />
            {addressSugggestions
              ? addressSugggestions.length > 0 && (
                  <div className="suggestions-container">
                    {addressSugggestions.map((suggestion) => {
                      return (
                        <div
                          key={'suggestion' + suggestion_counter++}
                          onMouseDown={() => {
                            getAddress(suggestion.text);
                          }}
                          className="suggestion"
                        >
                          {suggestion.text}
                        </div>
                      );
                    })}
                  </div>
                )
              : null}
            {errors.address && (
              <span className={styles.formErrors}>
                {t('donate:addressRequired')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('donate:city')}
              variant="outlined"
              name="city"
              defaultValue={contactDetails.city}
            />
            {errors.city && (
              <span className={styles.formErrors}>
                {t('donate:cityRequired')}
              </span>
            )}
          </div>
          <div className={styles.formFieldHalf}>
            {postalRegex && (
              <MaterialTextField
                inputRef={register({
                  required: true,
                  pattern: postalRegex,
                })}
                label={t('donate:zipCode')}
                variant="outlined"
                name="zipCode"
                defaultValue={contactDetails.zipCode}
              />
            )}
            {errors.zipCode && (
              <span className={styles.formErrors}>
                {t('donate:zipCodeAlphaNumValidation')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formField}>
          <div className={styles.formFieldLarge}>
            <AutoCompleteCountry
              inputRef={register({ required: true })}
              label={t('donate:country')}
              name="country"
              onChange={changeCountry}
              defaultValue={contactDetails.country}
            />
            {errors.country && (
              <span className={styles.formErrors}>
                {t('donate:countryRequired')}
              </span>
            )}
          </div>
        </div>
        {/* </form> */}
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ContactDetails;
