import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import BackArrow from '../../../../public/assets/images/icons/headerIcons/BackArrow';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountry';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import { ContactDetailsPageProps } from '../../common/types/donations';
import styles from '../styles/Donations.module.scss';
import i18next from '../../../../i18n';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';
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
  project,
}: ContactDetailsPageProps): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common']);

  const { register, handleSubmit, errors } = useForm({ mode: 'all' });

  const onSubmit = (data: any) => {
    const submitdata = data;    
    if(!isCompany){
      submitdata.companyName = ''
    }
    setContactDetails({ ...contactDetails, ...submitdata });
    setDonationStep(3);
  };

  const changeCountry = (country: any) => {
    setContactDetails({ ...contactDetails, country });
  };

  const defaultCountry = isTaxDeductible
    ? country
    : localStorage.getItem('countryCode');

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
  return ready ? (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        <div className={styles.headerTitleContainer}>
          <button
            id={'backArrowContact'}
            onClick={() => setDonationStep(1)}
            className={styles.headerBackIcon}
          >
            <BackArrow color={styles.light} />
          </button>
          <div>
            <div className={styles.headerTitle}>
              {t('donate:contactDetails')}
            </div>
            <div style={{display:'flex',flexDirection:'row'}}>
              <div className={styles.totalCost} style={{color:styles.light}}>
                {getFormatedCurrency(
                  i18n.language,
                  currency,
                  treeCount * treeCost
                )}
              </div>
              <div className={styles.totalCostText} style={{color:styles.light}}>
                {t('donate:fortreeCountTrees', {
                   count: Number(treeCount),
                  treeCount: getFormattedNumber(
                    i18n.language,
                    Number(treeCount)
                  ),
                })}
              </div>
            </div>
            <div className={styles.plantProjectName}>
              {t('common:to_project_by_tpo', {
                projectName: project.name,
                tpoName: project.tpo.name,
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.treeDonationContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formRow}>
            <div className={styles.formRowInput}>
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
            <div className={styles.formRowInput}>
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
            <div className={styles.formRowInput}>
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
          <div className={styles.formRowInput}>
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

        <div className={styles.isCompany} style={{alignItems:'baseline'}}>
          <div className={styles.isCompanyText}>
            <label className={styles.isCompanyText} htmlFor="checkedB">{t('donate:isACompanyDonation')}</label>
            {isCompany ? (
              <div className={styles.isCompany} style={{marginTop:'10px'}}>
                <label className={styles.isCompanyText} style={{fontSize:'12px', fontStyle:'italic'}}>
                  {isTaxDeductible ?  t('donate:orgNamePublishedTax') : t('donate:orgNamePublished')}
                </label>
              </div>
            ) : null}
          </div>
          <ToggleSwitch
            checked={isCompany}
            onChange={() => setIsCompany(!isCompany)}
            name="checkedB"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            id="checkedB"
          />
        </div>
        {isCompany ? (
          <>
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
          </>
        ) : null}

        

          <div className={styles.horizontalLine} />

          <div className={styles.actionButtonsContainerCenter}>
            {errors.firstName ||
            errors.lastName ||
            errors.email ||
            errors.address ||
            errors.city ||
            errors.zipCode ||
            errors.country ? (
              <AnimatedButton className={styles.continueButtonDisabled}>
                {t('common:continue')}
              </AnimatedButton>
            ) : (
              <button
                onClick={handleSubmit(onSubmit)}
                className="primaryButton"
                style={{borderRadius: "10px"}}
              >
                {t('common:continue')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ContactDetails;
