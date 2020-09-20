import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import Sugar from 'sugar';
import getTranslation from '../../../../../public/locales/getTranslations';
import BackArrow from '../../../../assets/images/icons/headerIcons/BackArrow';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';
import MaterialTextFeild from '../../../common/InputTypes/MaterialTextFeild';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import { ContactDetailsPageProps } from './../../../common/types/donations';
import styles from './../styles/ContactDetails.module.scss';

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
  const t = getTranslation();
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data: any) => {
    setDonationStep(3);
  };
  const changeContactDetails = (e: any) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
  };

  const changeCountry = (country: any) => {
    setContactDetails({ ...contactDetails, country: country });
  };

  let defaultCountry = isTaxDeductible
    ? country
    : localStorage.getItem('countryCode');
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          onClick={() => setDonationStep(1)}
          className={styles.headerBackIcon}
        >
          <BackArrow color={styles.primaryFontColor} />
        </div>
        <div className={styles.headerTitle}>{t.contactDetails}</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formRow}>
          <div>
            <MaterialTextFeild
              inputRef={register({ required: true })}
              label={t.firstName}
              variant="outlined"
              name="firstName"
              onChange={changeContactDetails}
              defaultValue={contactDetails.firstName}
            />
            {errors.firstName && (
              <span className={styles.formErrors}>{t.firstNameRequired}</span>
            )}
          </div>

          <div style={{ width: '20px' }}></div>
          <div>
            <MaterialTextFeild
              inputRef={register({ required: true })}
              label={t.lastName}
              variant="outlined"
              name="lastName"
              onChange={changeContactDetails}
              defaultValue={contactDetails.lastName}
            />
            {errors.lastName && (
              <span className={styles.formErrors}>{t.lastNameRequired}</span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextFeild
              inputRef={register({
                required: true,
                pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i,
              })}
              label={t.email}
              variant="outlined"
              name="email"
              onChange={changeContactDetails}
              defaultValue={contactDetails.email}
            />
            {errors.email && (
              <span className={styles.formErrors}>{t.emailRequired}</span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextFeild
              inputRef={register({ required: true })}
              label={t.address}
              variant="outlined"
              name="address"
              onChange={changeContactDetails}
              defaultValue={contactDetails.address}
            />
            {errors.address && (
              <span className={styles.formErrors}>{t.addressRequired}</span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div>
            <MaterialTextFeild
              inputRef={register({ required: true })}
              label={t.city}
              variant="outlined"
              name="city"
              onChange={changeContactDetails}
              defaultValue={contactDetails.city}
            />
            {errors.city && (
              <span className={styles.formErrors}>{t.cityRequired}</span>
            )}
          </div>

          <div style={{ width: '20px' }}></div>
          <div>
            <MaterialTextFeild
              inputRef={register({})}
              label={t.zipCode}
              variant="outlined"
              name="zipCode"
              onChange={changeContactDetails}
              defaultValue={contactDetails.zipCode}
            />
            {errors.zipCode && (
              <span className={styles.formErrors}>
                ZipCode is should only be Alpha Numeric
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <AutoCompleteCountry
              inputRef={register({ required: true })}
              label={t.country}
              name="country"
              onChange={changeCountry}
              defaultValue={
                contactDetails.country ? contactDetails.country : defaultCountry
              }
            />
            {errors.country && (
              <span className={styles.formErrors}>{t.countryRequired}</span>
            )}
          </div>
        </div>

        <div className={styles.isCompany}>
          <div className={styles.isCompanyText}>{t.isACompanyDonation}</div>
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
              <MaterialTextFeild
                label={t.companyName}
                name="companyName"
                variant="outlined"
                inputRef={
                  isCompany ? register({ required: true }) : register({})
                }
                onChange={changeContactDetails}
                defaultValue={contactDetails.companyName}
              />
              {errors.companyName && (
                <span className={styles.formErrors}>{t.companyRequired}</span>
              )}
            </div>
          </div>
        ) : null}

        <div className={styles.horizontalLine} />

        <div className={styles.finalTreeCount}>
          <div className={styles.totalCost}>
            {currency} {Sugar.Number.format(Number(treeCount * treeCost), 2)}
          </div>
          <div className={styles.totalCostText}>
            {t.fortreeCountTrees({
              treeCount: Sugar.Number.format(Number(treeCount)),
            })}
          </div>
        </div>

        <div className={styles.actionButtonsContainer}>
          <AnimatedButton
            onClick={handleSubmit(onSubmit)}
            className={styles.continueButton}
          >
            {t.continue}
          </AnimatedButton>
        </div>
      </form>
    </div>
  );
}

export default ContactDetails;
