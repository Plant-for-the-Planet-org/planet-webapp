import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import styles from '../src/features/user/UserProfile/styles/EditProfileModal.module.scss';
import MaterialTextField from '../src/features/common/InputTypes/MaterialTextFeild';
import ToggleSwitch from '../src/features/common/InputTypes/ToggleSwitch';

export default function UserProfile() {
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
    <Layout>
      <div
        style={{
          backgroundImage: `url('/app-background.png')`,
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className={styles.SignupContainer}>
          <div className={styles.signup}>
            <div style={btnContainer}>
              <button
                type="button"
                style={accountType === 'individual' ? btnColor : btnSize}
                onClick={() => setAccountType('individual')}
              >
                <div style={{ display: 'flex', padding: '4px', margin: 0 }}>
                  <p
                    style={{
                      paddingTop: '30px',
                      justifyContent: 'flex-start',
                      textTransform: 'capitalize',
                      color: accountType === 'individual' ? '#68b030' : '#000000',
                    }}
                  >
                    Individual{' '}
                  </p>
                </div>
              </button>
              <button
                type="button"
                style={accountType === 'organisation' ? btnColor : btnSize}
                onClick={() => setAccountType('organisation')}
              >
                <div style={{ display: 'flex', padding: '4px', margin: 0 }}>
                  <p
                    style={{
                      paddingTop: '30px',
                      justifyContent: 'flex-start',
                      textTransform: 'capitalize',
                      color: accountType === 'organisation' ? '#68b030' : '#000000',
                    }}
                  >
                    Organisation{' '}
                  </p>
                </div>
              </button>
            </div>
            <div style={btnContainer}>
              <button
                type="button"
                style={accountType === 'RO' ? btnColor : btnSize}
                onClick={() => setAccountType('RO')}
              >
                <div style={{ display: 'flex', padding: '4px', margin: 0 }}>
                  <p
                    style={{
                      paddingTop: '15px',
                      justifyContent: 'flex-start',
                      textTransform: 'capitalize',
                      paddingRight: '60px',
                      color: accountType === 'RO' ? '#68b030' : '#000000',
                    }}
                  >
                    Reforestation Organisation
                  </p>
                </div>
              </button>
              <button
                type="button"
                style={accountType === 'education' ? btnColor : btnSize}
                onClick={() => setAccountType('education')}
              >
                <div style={{ display: 'flex', padding: '4px', margin: 0 }}>
                  <p
                    style={{
                      paddingTop: '30px',
                      justifyContent: 'flex-start',
                      textTransform: 'capitalize',
                      color: accountType === 'education' ? '#68b030' : '#000000',
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
    </Layout>
  );
}

const btnSize = {
  width: '172px',
  height: '68px',
  borderRadius: '10px',
  border: 'solid 1.2px #000',
  margin: '5px',
  backgroundColor: 'white',
};
const btnColor = {
  border: 'solid 1.2px #68b030',
  margin: '5px',
  width: '172px',
  height: '68px',
  borderRadius: '10px',
  backgroundColor: 'white',
};
const btnContainer = {
  display: 'flex',
  justifyContent: 'space-between',
};
