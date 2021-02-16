import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import BackArrow from '../../../../public/assets/images/icons/headerIcons/BackArrow';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountry';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import { ContactDetailsPageProps } from '../../common/types/donations';
import styles from '../styles/ContactDetails.module.scss';
import i18next from '../../../../i18n';
import COUNTRY_ADDRESS_POSTALS from '../../../utils/countryZipCode';
import ShowTreeCount from '../components/ShowTreeCount';

const { useTranslation } = i18next;

function ContactDetails({
  treeCount,
  treeCost,
  currency,
  setDonationStep,
  contactDetails,
  setContactDetails,
  isCompany,
  setIsCompany,
  isTaxDeductible,
  country,
  token,
  recurrencyMnemonic
}: ContactDetailsPageProps): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common']);

  const { register, handleSubmit, errors } = useForm({ mode: 'all' });
    
  const onSubmit = (data: any) => {
    setContactDetails({...contactDetails,...data});
    setDonationStep(3);
  };

  const changeCountry = (country: any) => {
    setContactDetails({ ...contactDetails, country });
  };

  const defaultCountry = isTaxDeductible
    ? country
    : localStorage.getItem('countryCode');

  const [postalRegex, setPostalRegex] = React.useState(COUNTRY_ADDRESS_POSTALS.filter((country) => country.abbrev === contactDetails.country)[0]?.postal)

  React.useEffect(() => {
    const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter((country) => country.abbrev === contactDetails.country);
    setPostalRegex(fiteredCountry[0]?.postal);
  }, [contactDetails.country])
  return ready ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <button id={'backArrowContact'}
          onClick={() => setDonationStep(1)}
          className={styles.headerBackIcon}
        >
          <BackArrow color={styles.primaryFontColor} />
        </button>
        <div className={styles.headerTitle}>{t('donate:contactDetails')}</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formRow}>
          <div>
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

          <div style={{ width: '20px' }} />
          <div>
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
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextField
              inputRef={register({
                required: true,
                pattern: /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
              })}
              label={t('donate:email')}
              variant="outlined"
              name="email"
              defaultValue={contactDetails.email}
              disabled={token ? true : false}
            />
            {errors.email && (
              <span className={styles.formErrors}>
                {t('donate:emailRequired')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('donate:address')}
              variant="outlined"
              name="address"
              defaultValue={contactDetails.address}
            />
            {errors.address && (
              <span className={styles.formErrors}>
                {t('donate:addressRequired')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div>
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

          <div style={{ width: '20px' }} />
          <div>
            {
              postalRegex && (
                <MaterialTextField
                  inputRef={register({
                    required: true,
                    pattern: postalRegex
                  })}
                  label={t('donate:zipCode')}
                  variant="outlined"
                  name="zipCode"
                  defaultValue={contactDetails.zipCode}
                />
              )
            }
            {errors.zipCode && (
              <span className={styles.formErrors}>
                {t('donate:zipCodeAlphaNumValidation')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <AutoCompleteCountry
              inputRef={register({ required: true })}
              label={t('donate:country')}
              name="country"
              onChange={changeCountry}
              defaultValue={
                contactDetails.country ? contactDetails.country : defaultCountry
              }
            />
            {errors.country && (
              <span className={styles.formErrors}>
                {t('donate:countryRequired')}
              </span>
            )}
          </div>
        </div>

        <div className={styles.isCompany}>
          <div className={styles.isCompanyText}>
            {t('donate:isACompanyDonation')}
          </div>
          <ToggleSwitch
            checked={isCompany}
            onChange={() => setIsCompany(!isCompany)}
            name="checkedB"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
        {isCompany ? (
          <div className={styles.formRow}>
            <div style={{ width: '100%' }}>
              <MaterialTextField
                label={t('donate:companyName')}
                name="companyName"
                variant="outlined"
                inputRef={
                  isCompany ? register({ required: true }) : register({})
                }
                defaultValue={contactDetails.companyName}
              />
              {errors.companyName && (
                <span className={styles.formErrors}>
                  {t('donate:companyRequired')}
                </span>
              )}
            </div>
          </div>
        ) : null}

        <div className={styles.horizontalLine} />

        <ShowTreeCount treeCost={treeCost} treeCount={treeCount} currency={currency} recurrencyMnemonic={recurrencyMnemonic} />

        <div className={styles.actionButtonsContainer}>

          {errors.firstName || errors.lastName || errors.email || errors.address || errors.city || errors.zipCode || errors.country ?
            <AnimatedButton
              className={styles.continueButtonDisabled}
            >
              {t('common:continue')}
            </AnimatedButton>
            :
            <AnimatedButton
              onClick={handleSubmit(onSubmit)}
              className={styles.continueButton}
            >
              {t('common:continue')}
            </AnimatedButton>
          }
        </div>
      </form>
    </div>
  ) : <></>;
}

export default ContactDetails;
