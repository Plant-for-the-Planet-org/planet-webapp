import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import Sugar from 'sugar';
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
  country
}: ContactDetailsPageProps): ReactElement {
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

  let defaultCountry = isTaxDeductible ? country : localStorage.getItem('countryCode');
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          onClick={() => setDonationStep(1)}
          className={styles.headerBackIcon}
        >
          <BackArrow color={styles.primaryFontColor} />
        </div>
        <div className={styles.headerTitle}>Contact Details</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formRow}>
          <div>
            <MaterialTextFeild
              inputRef={register({ required: true })}
              label="First Name"
              variant="outlined"
              name="firstName"
              onChange={changeContactDetails}
              defaultValue={contactDetails.firstName}
            />
            {errors.firstName && (
              <span className={styles.formErrors}>
                First Name field is required
              </span>
            )}
          </div>

          <div style={{ width: '20px' }}></div>
          <div>
            <MaterialTextFeild
              inputRef={register({ required: true })}
              label="Last Name"
              variant="outlined"
              name="lastName"
              onChange={changeContactDetails}
              defaultValue={contactDetails.lastName}
            />
            {errors.lastName && (
              <span className={styles.formErrors}>
                Last Name field is required
              </span>
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
              label="Email"
              variant="outlined"
              name="email"
              onChange={changeContactDetails}
              defaultValue={contactDetails.email}
            />
            {errors.email && (
              <span className={styles.formErrors}>Email is required</span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextFeild
              inputRef={register({ required: true })}
              label="Address"
              variant="outlined"
              name="address"
              onChange={changeContactDetails}
              defaultValue={contactDetails.address}
            />
            {errors.address && (
              <span className={styles.formErrors}>Address is required</span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div>
            <MaterialTextFeild
              inputRef={register({ required: true })}
              label="City"
              variant="outlined"
              name="city"
              onChange={changeContactDetails}
              defaultValue={contactDetails.city}
            />
            {errors.city && (
              <span className={styles.formErrors}>City is required</span>
            )}
          </div>

          <div style={{ width: '20px' }}></div>
          <div>
            <MaterialTextFeild
              inputRef={register({})}
              label="Zip Code"
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
              label="Country"
              name="country"
              onChange={changeCountry}
              defaultValue={contactDetails.country ? contactDetails.country : defaultCountry}
            />
            {errors.country && (
              <span className={styles.formErrors}>Country is required</span>
            )}
          </div>
        </div>

        <div className={styles.isCompany}>
          <div className={styles.isCompanyText}>This is a company donation</div>
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
                label="Company Name"
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
                  Company Name is required
                </span>
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
            for {Sugar.Number.format(Number(treeCount))} Trees
          </div>
        </div>

        <div className={styles.actionButtonsContainer}>
          <AnimatedButton
            onClick={handleSubmit(onSubmit)}
            className={styles.continueButton}
          >
            Continue
          </AnimatedButton>
        </div>
      </form>
    </div>
  );
}

export default ContactDetails;
