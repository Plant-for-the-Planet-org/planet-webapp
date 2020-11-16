import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import Sugar from 'sugar';
import BackArrow from '../../../../public/assets/images/icons/headerIcons/BackArrow';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountry';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import { ContactDetailsPageProps } from '../../common/types/donations';
import styles from '../styles/ContactDetails.module.scss';
import i18next from '../../../../i18n/server';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import COUNTRY_ADDRESS_POSTALS from '../../../utils/countryZipCode';

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
}: ContactDetailsPageProps): ReactElement {
  const { t, i18n } = useTranslation(['donate', 'common']);

  const { register, handleSubmit, errors } = useForm({ mode: 'all' });
  const onSubmit = (data: any) => {
    setDonationStep(3);
  };
  const changeContactDetails = (e: any) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
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
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          onClick={() => setDonationStep(1)}
          className={styles.headerBackIcon}
        >
          <BackArrow color={styles.primaryFontColor} />
        </div>
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
              onChange={changeContactDetails}
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
              onChange={changeContactDetails}
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
              onChange={changeContactDetails}
              defaultValue={contactDetails.email}
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
              onChange={changeContactDetails}
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
              onChange={changeContactDetails}
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
                  onChange={changeContactDetails}
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
                onChange={changeContactDetails}
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

        <div className={styles.finalTreeCount}>
          <div className={styles.totalCost}>
            {getFormatedCurrency(i18n.language, currency, treeCount * treeCost)}
          </div>
          <div className={styles.totalCostText}>
            {t('donate:fortreeCountTrees', {
              treeCount: Sugar.Number.format(Number(treeCount)),
            })}
          </div>
        </div>

        <div className={styles.actionButtonsContainer}>

          {errors.firstName || errors.lastName || errors.email || errors.address || errors.city || errors.zipCode || errors.country  ? 
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
  );
}

export default ContactDetails;
