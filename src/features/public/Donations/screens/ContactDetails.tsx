import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import BackArrow from '../../../../assets/images/icons/headerIcons/BackArrow';
import MaterialTextFeild from './../../../common/InputTypes/MaterialTextFeild';
import styles from './../styles/ContactDetails.module.scss';

interface Props {
  treeCount: number;
  treeCost: number;
  currency: String;
  setDonationStep: Function;
}

function ContactDetails({
  treeCount,
  treeCost,
  currency,
  setDonationStep,
}: Props): ReactElement {
  const [isCompany, setIsCompany] = React.useState(false);
  const continueNext = () => {
    setDonationStep(3);
  };
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          onClick={() => setDonationStep(1)}
          className={styles.headerBackIcon}
        >
          <BackArrow />
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
              label="Address Line 1"
              variant="outlined"
              name="address"
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
            />
            {errors.city && (
              <span className={styles.formErrors}>City is required</span>
            )}
          </div>

          <div style={{ width: '20px' }}></div>
          <div>
            <MaterialTextFeild
              inputRef={register({ pattern: /^(0|[1-9][0-9]*)$/i })}
              label="Zip Code"
              variant="outlined"
              name="zipCode"
            />
            {errors.zipCode && (
              <span className={styles.formErrors}>
                ZipCode is should only be Numeric
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextFeild
              inputRef={register({ required: true })}
              label="Country"
              variant="outlined"
              name="country"
            />
            {errors.country && (
              <span className={styles.formErrors}>Country is required</span>
            )}
          </div>
        </div>

        <div className={styles.isCompany}>
          <div className={styles.isCompanyText}>This is a Company Donation</div>
          <Switch
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
                inputRef={register({ required: true })}
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
            {currency} {(treeCount * treeCost).toFixed(2)}{' '}
          </div>
          <div className={styles.totalCostText}>for {treeCount} Trees</div>
        </div>

        <div className={styles.actionButtonsContainer}>
          <input
            type="submit"
            value="Continue"
            className={styles.continueButton}
          />
        </div>
      </form>
    </div>
  );
}

export default ContactDetails;
