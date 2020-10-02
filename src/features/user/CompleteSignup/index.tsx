import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../../common/Layout';
import styles from './CompleteSignup.module.scss';
import MaterialTextField from '../../common/InputTypes/MaterialTextFeild';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';

export default function CompleteSignup() {
  const router = useRouter();
  const [session, loading] = useSession();
  const [isPrivateAccount, setIsPrivateAccount] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [accountType, setAccountType] = useState('RO');
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [nameOfOrg, setNameOfOrg] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [country, setCountry] = useState(null);

  // if (!session) {
  //   if (typeof window !== 'undefined') {
  //     router.push('/');
  //   }
  // }
  if (loading) {
    return null;
  }

  const SelectType = (type: any) => {
    let name;
    switch (type) {
      case 'individual':
        name = 'Individual';
        break;
      case 'RO':
        name = 'Reforestation Organisation';
        break;
      case 'education':
        name = 'School';
        break;
      case 'organisation':
        name = 'Company';
        break;
      default:
        name = 'Reforestation Organisation';
        break;
    }
    return name;
  };
  return (
      <div
        style={{
          backgroundImage: `url(${process.env.CDN_URL}/media/images/app/bg_layer.jpg)`,
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className={styles.SignupContainer}>
          <div className={styles.signup}>
            <div className={styles.btnContainer}>
              <button
                type="button"
                className={accountType === 'individual' ? styles.btnColor : styles.btnSize}
                onClick={() => setAccountType('individual')}
              >
                <div className={styles.accountTypeDiv}>
                  <p
                    style={{
                      paddingTop: '30px',
                      justifyContent: 'flex-start',
                      textTransform: 'capitalize',
                      color: accountType === 'individual' ? styles.primaryColor : styles.dark,
                    }}
                  >
                    Individual{' '}
                  </p>
                </div>
              </button>
              <button
                type="button"
                className={accountType === 'organisation' ? styles.btnColor : styles.btnSize}
                onClick={() => setAccountType('organisation')}
              >
                <div className={styles.accountTypeDiv}>
                  <p
                    style={{
                      paddingTop: '30px',
                      justifyContent: 'flex-start',
                      textTransform: 'capitalize',
                      color: accountType === 'organisation' ? styles.primaryColor : styles.dark,
                    }}
                  >
                    Organisation{' '}
                  </p>
                </div>
              </button>
            </div>
            <div className={styles.btnContainer}>
              <button
                type="button"
                className={accountType === 'RO' ? styles.btnColor : styles.btnSize}
                onClick={() => setAccountType('RO')}
              >
                <div className={styles.accountTypeDiv}>
                  <p
                    style={{
                      paddingTop: '15px',
                      justifyContent: 'flex-start',
                      textTransform: 'capitalize',
                      paddingRight: '60px',
                      color: accountType === 'RO' ? styles.primaryColor :styles.dark,
                    }}
                  >
                    Reforestation Organisation
                  </p>
                </div>
              </button>
              <button
                type="button"
                className={accountType === 'education' ? styles.btnColor : styles.btnSize}
                onClick={() => setAccountType('education')}
              >
                <div className={styles.accountTypeDiv}>
                  <p
                    style={{
                      paddingTop: '30px',
                      justifyContent: 'flex-start',
                      textTransform: 'capitalize',
                      color: accountType === 'education' ? styles.primaryColor : styles.dark,
                    }}
                  >
                    Education{' '}
                  </p>
                </div>
              </button>
            </div>

            <div className={styles.namesDiv}>
              <div className={styles.firstNameDiv}>
                <MaterialTextField
                  label="First Name"
                  variant="outlined"
                  onChange={(text) => setFirstName(text)}
                />
              </div>

              <div className={styles.lastNameDiv}>
                <MaterialTextField
                  label="Last Name"
                  variant="outlined"
                  onChange={(text) => setLastName(text)}
                />
              </div>
            </div>
            {accountType === 'education' ||
            accountType === 'organisation' ||
            accountType === 'RO' ? (
              <div className={styles.addressDiv}>
                <MaterialTextField
                  label={`Name of ${SelectType(accountType)}`}
                  variant="outlined"
                  onChange={(text) => setNameOfOrg(text)}
                />
              </div>
            ) : null}
            {accountType === 'RO' ? (
              <div>
                <div className={styles.addressDiv}>
                  <MaterialTextField
                    label="Address"
                    variant="outlined"
                    onChange={(text) => setAddress(text)}
                  />
                </div>

                <div className={styles.cityZipDiv}>
                  <div className={styles.cityDiv}>
                    <MaterialTextField
                      label="City"
                      variant="outlined"
                      onChange={(text) => setCity(text)}
                    />
                  </div>
                  <div className={styles.zipDiv}>
                    <MaterialTextField
                      label="Zip Code"
                      variant="outlined"
                      onChange={(text) => setZipCode(text)}
                    />
                  </div>
                </div>

                <div className={styles.countryDiv}>
                  <MaterialTextField
                    label="Country"
                    variant="outlined"
                    onChange={(text) => setCountry(text)}
                  />
                </div>
              </div>
            ) : null}
            <div className={styles.isPrivateAccountDiv}>
              <div>
                <div className={styles.mainText}>Private Account</div>
                <div className={styles.isPrivateAccountText}>
                  Your profile is hidden and only your first name appears in the
                  leaderboard
                </div>
              </div>
              <ToggleSwitch
                checked={isSubscribed}
                onChange={() => setIsSubscribed(!isSubscribed)}
                name="checkedB"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>

            <div className={styles.isPrivateAccountDiv}>
              <div className={styles.mainText}>Subscribe to news via email</div>

              <ToggleSwitch
                checked={isPrivateAccount}
                onChange={() => setIsPrivateAccount(!isPrivateAccount)}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>

            <div className={styles.horizontalLine} />

            <div className={styles.saveButton}>Create Account</div>
          </div>
        </div>
      </div>
  );
}